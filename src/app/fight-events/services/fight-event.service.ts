import { Injectable } from '@angular/core';
import { EventConfig } from "app/event-config/event-config";
import { FightEvent } from "../models/fight-event";
import { CombatEvent } from "app/warcraft-logs/combat-event";
import { AbilityEvent, Ability } from "../models/ability-event";
import { Fight, Report } from "app/warcraft-logs/report";
import { PhaseChangeEvent } from "../models/phase-change-event";
import { DebuffEvent } from "../models/debuff-event";
import { HeroismEvent } from "../models/heroism-event";
import { SpawnEvent } from "../models/spawn-event";
import { DamageEvent } from "../models/damage-event";
import { Death } from "app/warcraft-logs/death";
import { DeathEvent } from "../models/death-event";

@Injectable()
export class FightEventService {

    getEvents(report: Report, fight: Fight, config: EventConfig, combatEvents: CombatEvent[], deaths: Death[], timestampOffset: number = 0): FightEvent[] {
        switch (config.eventType) {
            case "heroism":
                return this.getHeroismEvents(report, fight, config, combatEvents);
            case "ability":
                return this.getAbilityEvents(report, fight, config, combatEvents);
            case "damage":
                return this.getDamageEvents(report, fight, config, combatEvents, timestampOffset);
            case "phase":
                return this.getPhaseChangeEvents(report, fight, config, combatEvents);
            case "debuff":
                return this.getDebuffEvents(report, fight, config, combatEvents);
            case "spawn":
                return this.getSpawnEvents(report, fight, config, combatEvents);
            case "death":
                return this.getDeathEvents(report, fight, config, deaths);
            default: {
                throw new Error(`'${config.eventType}' is an unsupported event type`);
            }
        }
    }

    private getHeroismEvents(report: Report, fight: Fight, config: EventConfig, combatEvents: CombatEvent[]): HeroismEvent[] {
        let events = combatEvents.map(x => Math.ceil(x.timestamp / 1000))
            .filter((x, index, array) => array.indexOf(x) == index && array.filter(y => y == x).length >= 10) // Only show if 10 or more people affected
            .map(x => new HeroismEvent(
                config,
                x * 1000 - fight.start_time,
                new Ability(combatEvents.find(y => y.timestamp - x * 1000 < 1000).ability)));

        return events;
    }
    
    private getAbilityEvents(report: Report, fight: Fight, config: EventConfig, combatEvents: CombatEvent[]): AbilityEvent[] {
        let events = combatEvents.map(
            x => new AbilityEvent(
                config,
                x.timestamp - fight.start_time,
                config.friendly || x.sourceIsFriendly,
                config.source ? config.source : this.getCombatEventSource(x, report) ? this.getCombatEventSource(x, report).name : null,
                new Ability(x.ability),
                combatEvents.filter(y => y.ability.name == x.ability.name && y.timestamp < x.timestamp).length + 1,
                config.target ? config.target : this.getCombatEventTarget(x, report) ? this.getCombatEventTarget(x, report).name : null,
                config.showTarget || false));

        return events;
    }

    private getDamageEvents(report: Report, fight: Fight, config: EventConfig, combatEvents: CombatEvent[], timestampOffset): DamageEvent[] {
        let events = combatEvents.map(
            x => new DamageEvent(
                config,
                x.timestamp - fight.start_time + timestampOffset,
                config.friendly || x.sourceIsFriendly,
                new Ability(x.ability),
                x.amount,
                x.absorbed,
                x.overkill));

        return events;
    }

    private getPhaseChangeEvents(report: Report, fight: Fight, config: EventConfig, combatEvents: CombatEvent[]): PhaseChangeEvent[] {
        if (!config.filter) {
            return [new PhaseChangeEvent(config, config.timestamp, config.name)];
        }

        if (combatEvents.length == 0) return [];

        if (config.filter) {
            if (config.filter.type == "percent") {
                let combatEvent =
                    combatEvents
                        .sort((a, b) => a.timestamp - b.timestamp)
                        .find(x => (x.hitPoints * 100 / x.maxHitPoints) <= config.filter.actor.percent + 1);

                if (combatEvent) {
                    return [new PhaseChangeEvent(config, combatEvent.timestamp - fight.start_time - 1, config.name)];
                } else {
                    return [];
                }
            }

            return combatEvents.map(x => new PhaseChangeEvent(config, x.timestamp - fight.start_time - 1, config.name));
        }
    }

    private getDebuffEvents(report: Report, fight: Fight, config: EventConfig, combatEvents: CombatEvent[]): DebuffEvent[] {
        let events = combatEvents.map(
            x => new DebuffEvent(
                config,
                x.timestamp - fight.start_time,
                config.friendly,
                config.target ? config.target : this.getCombatEventTarget(x, report).name,
                new Ability(x.ability),
                combatEvents.filter((y, index, array) => y.ability.name == x.ability.name && array.indexOf(y) < array.indexOf(x)).length + 1));

        return events;
    }

    private getSpawnEvents(report: Report, fight: Fight, config: EventConfig, combatEvents: CombatEvent[]): SpawnEvent[] {
        let events = combatEvents.map(
            (x, index) => new SpawnEvent(
                config,
                x.timestamp - fight.start_time,
                config.friendly,
                config.name,
                index + 1));

        return events;
    }

    private getDeathEvents(report: Report, fight: Fight, config: EventConfig, deaths: Death[]): DeathEvent[] {
        let events = deaths.map((death, index) =>
            new DeathEvent(
                config,
                index,
                report,
                fight,
                death.timestamp - fight.start_time,
                true,
                death.name,
                death.events && death.events[0] && death.events[0].ability ? new Ability(death.events[0].ability) : null,
                death.events && death.events[0] && this.getCombatEventSource(death.events[0], report) ? this.getCombatEventSource(death.events[0], report).name : null,
                death.deathWindow,
                death.damage.total,
                death.healing.total,
                this.getEvents(report, fight, new EventConfig({ eventType: "damage" }), death.events, deaths, fight.start_time - death.timestamp)));

        return events;
    }

    getCombatEventSource(event: CombatEvent, report: Report) {
        if (event.sourceIsFriendly) {
            return report.friendlies.find(x => x.id === event.sourceID);
        } else {
            return report.enemies.find(x => x.id === event.sourceID);
        }
    }

    getCombatEventTarget(event: CombatEvent, report: Report) {
        if (event.targetIsFriendly) {
            return report.friendlies.find(x => x.id === event.targetID);
        } else {
            return report.enemies.find(x => x.id === event.targetID);
        }
    }

}
