import { Injectable } from '@angular/core';
import { EventConfig } from 'app/event-config/event-config';
import { DebuffStackEvent } from 'app/fight-events/models/debuff-stack-event';
import { InterruptEvent } from 'app/fight-events/models/interrupt-event';
import { RemoveDebuffEvent } from 'app/fight-events/models/remove-debuff-event';
import { TitleEvent } from 'app/fight-events/models/title-event';
import { CombatEvent } from 'app/warcraft-logs/combat-event';
import { Death } from 'app/warcraft-logs/death';
import { Actor, Fight, Report } from 'app/warcraft-logs/report';
import { Ability, AbilityEvent } from '../models/ability-event';
import { DamageEvent } from '../models/damage-event';
import { DeathEvent } from '../models/death-event';
import { DebuffEvent } from '../models/debuff-event';
import { FightEvent } from '../models/fight-event';
import { HeroismEvent } from '../models/heroism-event';
import { PhaseChangeEvent } from '../models/phase-change-event';
import { SpawnEvent } from '../models/spawn-event';

@Injectable()
export class FightEventService {
  getEvents(
    report: Report,
    fight: Fight,
    config: EventConfig,
    combatEvents: CombatEvent[],
    deaths: Death[],
    timestampOffset: number = 0,
    isChild: boolean = false
  ): FightEvent[] {
    if (!config.difficulties) {
      config.difficulties = [3, 4, 5];
    }
    if (config.difficulties.indexOf(fight.difficulty) == -1) {
      return [];
    }

    switch (config.eventType) {
      case 'heroism':
        return this.getHeroismEvents(report, fight, config, combatEvents);
      case 'ability':
        return this.getAbilityEvents(report, fight, config, combatEvents);
      case 'damage':
        return this.getDamageEvents(
          report,
          fight,
          config,
          combatEvents,
          timestampOffset,
          isChild
        );
      case 'phase':
        return this.getPhaseChangeEvents(report, fight, config, combatEvents);
      case 'debuff':
        return this.getDebuffEvents(report, fight, config, combatEvents);
      case 'debuffstack':
        return this.getDebuffStackEvents(report, fight, config, combatEvents);
      case 'removedebuff':
        return this.getRemoveDebuffEvents(report, fight, config, combatEvents);
      case 'interrupt':
        return this.getInterruptEvents(report, fight, config, combatEvents);
      case 'spawn':
        return this.getSpawnEvents(report, fight, config, combatEvents);
      case 'death':
        return this.getDeathEvents(report, fight, config, deaths);
      case 'title':
        return this.getTitleEvents(report, fight, config, combatEvents);
      default: {
        throw new Error(`'${config.eventType}' is an unsupported event type`);
      }
    }
  }

  private getHeroismEvents(
    report: Report,
    fight: Fight,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): HeroismEvent[] {
    const events = combatEvents
      .map(x => Math.ceil(x.timestamp / 1000))
      .filter(
        (x, index, array) =>
          array.indexOf(x) == index && array.filter(y => y == x).length >= 10
      ) // Only show if 10 or more people affected
      .map(
        x =>
          new HeroismEvent(
            config,
            x * 1000 - fight.start_time,
            new Ability(
              combatEvents.find(y => y.timestamp - x * 1000 < 1000).ability
            )
          )
      );

    return events;
  }

  private getAbilityEvents(
    report: Report,
    fight: Fight,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): AbilityEvent[] {
    const events = combatEvents
      .map(
        x =>
          new AbilityEvent(
            config,
            x.timestamp - fight.start_time,
            config.friendly == undefined ? x.sourceIsFriendly : config.friendly,
            x.x,
            x.y,
            config.source
              ? new Actor(config.source)
              : this.getCombatEventSource(x, report),
            new Ability(x.ability),
            combatEvents.filter(
              y => y.ability.name == x.ability.name && y.timestamp < x.timestamp
            ).length + 1,
            config.target
              ? new Actor(config.target)
              : this.getCombatEventTarget(x, report),
            config.showTarget || false
          )
      )
      .filter(
        x =>
          !(
            !config.includePetTargets &&
            x.target &&
            x.target.hasOwnProperty('petOwner')
          )
      );

    return events;
  }

  private getDamageEvents(
    report: Report,
    fight: Fight,
    config: EventConfig,
    combatEvents: CombatEvent[],
    timestampOffset: number,
    isChild: boolean
  ): DamageEvent[] {
    const events = combatEvents
      .map(
        x =>
          new DamageEvent(
            config,
            x.timestamp - fight.start_time + timestampOffset,
            config.friendly || x.sourceIsFriendly,
            x.x,
            x.y,
            config.source
              ? new Actor(config.source)
              : this.getCombatEventSource(x, report),
            config.showSource,
            config.target
              ? new Actor(config.target)
              : this.getCombatEventTarget(x, report),
            new Ability(x.ability),
            x.amount,
            x.absorbed,
            x.overkill,
            isChild
          )
      )
      .filter(
        x =>
          x.target &&
          !(!config.includePetTargets && x.target.hasOwnProperty('petOwner'))
      );

    return events;
  }

  private getPhaseChangeEvents(
    report: Report,
    fight: Fight,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): PhaseChangeEvent[] {
    const collapsed = config.collapsed == undefined ? false : config.collapsed;

    if (
      !config.filter &&
      config.timestamp < fight.end_time - fight.start_time
    ) {
      return [
        new PhaseChangeEvent(config, config.timestamp, config.name, !collapsed)
      ];
    }

    if (combatEvents.length == 0) {
      return [];
    }

    if (config.filter) {
      if (config.filter.type == 'percent') {
        const combatEvent = combatEvents
          .sort((a, b) => a.timestamp - b.timestamp)
          .find(
            x =>
              x.hitPoints * 100 / x.maxHitPoints <=
              config.filter.actor.percent + 1
          );

        if (combatEvent) {
          return [
            new PhaseChangeEvent(
              config,
              combatEvent.timestamp - fight.start_time - 1,
              config.name,
              !collapsed
            )
          ];
        } else {
          return [];
        }
      }

      return combatEvents.map(
        x =>
          new PhaseChangeEvent(
            config,
            x.timestamp - fight.start_time - 1,
            config.name,
            !collapsed
          )
      );
    }
  }

  private getDebuffEvents(
    report: Report,
    fight: Fight,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): DebuffEvent[] {
    const events = combatEvents
      .map(
        x =>
          new DebuffEvent(
            config,
            x.timestamp - fight.start_time,
            config.friendly,
            x.x,
            x.y,
            config.target
              ? new Actor(config.target)
              : this.getCombatEventTarget(x, report),
            config.source
              ? new Actor(config.source)
              : this.getCombatEventSource(x, report),
            config.showSource,
            new Ability(x.ability),
            combatEvents.filter(
              (y, index, array) =>
                y.ability.name == x.ability.name &&
                array.indexOf(y) < array.indexOf(x)
            ).length + 1
          )
      )
      .filter(
        x =>
          !(
            !config.includePetTargets &&
            x.target &&
            x.target.hasOwnProperty('petOwner')
          )
      );

    return events;
  }

  private getDebuffStackEvents(
    report: Report,
    fight: Fight,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): DebuffStackEvent[] {
    const events = combatEvents
      .map(
        x =>
          new DebuffStackEvent(
            config,
            x.timestamp - fight.start_time,
            config.friendly,
            x.x,
            x.y,
            config.target
              ? new Actor(config.target)
              : this.getCombatEventTarget(x, report),
            config.source
              ? new Actor(config.source)
              : this.getCombatEventSource(x, report),
            config.showSource,
            new Ability(x.ability),
            x.stack,
            combatEvents.filter(
              (y, index, array) =>
                y.ability.name == x.ability.name &&
                y.stack == x.stack &&
                array.indexOf(y) < array.indexOf(x)
            ).length + 1
          )
      )
      .filter(
        x =>
          !(
            !config.includePetTargets &&
            x.target &&
            x.target.hasOwnProperty('petOwner')
          )
      );

    return events;
  }

  private getRemoveDebuffEvents(
    report: Report,
    fight: Fight,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): RemoveDebuffEvent[] {
    const events = combatEvents
      .map(
        x =>
          new RemoveDebuffEvent(
            config,
            x.timestamp - fight.start_time,
            config.friendly,
            x.x,
            x.y,
            config.target
              ? new Actor(config.target)
              : this.getCombatEventTarget(x, report),
            config.source
              ? new Actor(config.source)
              : this.getCombatEventSource(x, report),
            config.showSource,
            new Ability(x.ability),
            combatEvents.filter(
              (y, index, array) =>
                y.ability.name == x.ability.name &&
                array.indexOf(y) < array.indexOf(x)
            ).length + 1
          )
      )
      .filter(
        x =>
          !(
            !config.includePetTargets &&
            x.target &&
            x.target.hasOwnProperty('petOwner')
          )
      );

    return events;
  }

  private getInterruptEvents(
    report: Report,
    fight: Fight,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): InterruptEvent[] {
    const events = combatEvents
      .map(
        x =>
          new InterruptEvent(
            config,
            x.timestamp - fight.start_time,
            config.friendly || x.sourceIsFriendly,
            x.x,
            x.y,
            config.source
              ? new Actor(config.source)
              : this.getCombatEventSource(x, report),
            new Ability(x.extraAbility),
            combatEvents.filter(
              y =>
                y.extraAbility.name == x.extraAbility.name &&
                y.timestamp < x.timestamp
            ).length + 1,
            config.target
              ? new Actor(config.target)
              : this.getCombatEventTarget(x, report),
            config.showTarget || false
          )
      )
      .filter(
        x =>
          !(
            !config.includePetTargets &&
            x.target &&
            x.target.hasOwnProperty('petOwner')
          )
      );

    return events;
  }

  private getSpawnEvents(
    report: Report,
    fight: Fight,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): SpawnEvent[] {
    const events = combatEvents.map(
      (x, index) =>
        new SpawnEvent(
          config,
          x.timestamp - fight.start_time,
          config.friendly,
          x.x,
          x.y,
          new Actor(config.name),
          index + 1
        )
    );

    return events;
  }

  private getDeathEvents(
    report: Report,
    fight: Fight,
    config: EventConfig,
    deaths: Death[]
  ): DeathEvent[] {
    const events = deaths.map(
      (death, index) =>
        new DeathEvent(
          config,
          index,
          report,
          fight,
          death.timestamp - fight.start_time,
          true,
          this.getFriendly(death.id, report),
          death.events && death.events[0] && death.events[0].ability
            ? new Ability(death.events[0].ability)
            : null,
          death.events &&
          death.events[0] &&
          this.getCombatEventSource(death.events[0], report)
            ? this.getCombatEventSource(death.events[0], report)
            : null,
          death.deathWindow,
          death.damage.total,
          death.healing.total,
          this.getEvents(
            report,
            fight,
            new EventConfig({ eventType: 'damage' }),
            death.events,
            deaths,
            fight.start_time - death.timestamp,
            true
          )
        )
    );

    return events;
  }

  private getTitleEvents(
    report: Report,
    fight: Fight,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): TitleEvent[] {
    let title = config.title || config.name;

    if (config.timestamps) {
      return config.timestamps
        .filter(timestamp => timestamp < fight.end_time - fight.start_time)
        .map((timestamp, index) => {
          if (config.titles) {
            title = config.titles[index];
          }
          return new TitleEvent(
            timestamp,
            title,
            config.titles ? 0 : index + 1,
            true
          );
        });
    }

    if (
      !config.filter &&
      config.timestamp < fight.end_time - fight.start_time
    ) {
      return [new TitleEvent(config.timestamp, title, 0, true)];
    }

    return combatEvents.map(
      (combatEvent, index) =>
        new TitleEvent(combatEvent.timestamp, title, index + 1, true)
    );
  }

  getCombatEventSource(event: CombatEvent, report: Report) {
    if (event.sourceIsFriendly) {
      let id = event.sourceID;
      const pet = report.friendlyPets.find(x => x.id == id);
      if (pet) {
        id = pet.petOwner;
      }

      const friendly = JSON.parse(
        JSON.stringify(report.friendlies.find(x => x.id === id) || null)
      );
      if (friendly) {
        friendly.instance = event.sourceInstance;
      }

      return friendly;
    } else {
      const enemy = JSON.parse(
        JSON.stringify(
          report.enemies.find(x => x.id === event.sourceID) || null
        )
      );
      if (enemy) {
        enemy.instance = event.sourceInstance;
      }

      return enemy;
    }
  }

  getCombatEventTarget(event: CombatEvent, report: Report) {
    if (event.targetIsFriendly) {
      const id = event.targetID;
      const pet = report.friendlyPets.find(x => x.id == id);
      if (pet) {
        return pet;
      }

      const friendly = JSON.parse(
        JSON.stringify(
          report.friendlies.find(x => x.id === event.targetID) || null
        )
      );
      if (friendly) {
        friendly.instance = event.targetInstance;
      }

      return friendly;
    } else {
      const enemy = JSON.parse(
        JSON.stringify(
          report.enemies.find(x => x.id === event.targetID) || null
        )
      );
      if (enemy) {
        enemy.instance = event.targetInstance;
      }

      return enemy;
    }
  }

  getFriendly(id: number, report: Report): Actor {
    return report.friendlies.find(x => x.id === id);
  }
}
