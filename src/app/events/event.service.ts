import { Injectable } from '@angular/core';
import { EventConfig } from "app/event-config/event-config";
import { FightEvent } from "app/fight-events/fight-event";
import { CombatEvent } from "app/warcraft-logs/combat-event";
import { AbilityEvent, Ability } from "app/fight-events/ability-event";
import { Fight, Report } from "app/warcraft-logs/report";
import { PhaseChangeEvent } from "app/fight-events/phase-change-event";
import { DebuffEvent } from "app/fight-events/debuff-event";
import { HeroismEvent } from "app/fight-events/heroism-event";

@Injectable()
export class EventService {

    getEvents(report: Report, fight: Fight, config: EventConfig, combatEvents: CombatEvent[]): FightEvent[] {
        switch (config.eventType) {
            case "heroism":
                return this.getHeroismEvents(fight, config, combatEvents);
            case "ability":
                return this.getAbilityEvents(report, fight, config, combatEvents);
            case "phase":
                return this.getPhaseChangeEvents(fight, config, combatEvents);
            case "debuff":
                return this.getDebuffEvents(report, fight, config, combatEvents);
            default: {
                throw new Error(`'${config.eventType}' is an unsupported event type`);
            }
        }
    }

    private getHeroismEvents(fight: Fight, config: EventConfig, combatEvents: CombatEvent[]): HeroismEvent[] {
        let events = combatEvents.map(x => Math.ceil(x.timestamp / 1000))
            .filter((x, index, array) => array.indexOf(x) == index && array.filter(y => y == x).length >= 10) // Only show if 10 or more people affected
            .map(x => new HeroismEvent(
                x * 1000 - fight.start_time,
                new Ability(combatEvents.find(y => y.timestamp - x * 1000 < 1000).ability)));

        return events;
    }
    
    private getAbilityEvents(report: Report, fight: Fight, config: EventConfig, combatEvents: CombatEvent[]): AbilityEvent[] {
        let events = combatEvents.map(
            x => new AbilityEvent(
                x.timestamp - fight.start_time,
                x.sourceIsFriendly,
                this.getCombatEventSource(x, report).name,
                new Ability(x.ability),
                combatEvents.filter(y => y.ability.name == x.ability.name && y.timestamp < x.timestamp).length + 1));

        return events;
    }

    private getPhaseChangeEvents(fight: Fight, config: EventConfig, combatEvents: CombatEvent[]): PhaseChangeEvent[] {
        if (config.filter) {
            return [new PhaseChangeEvent(combatEvents[0].timestamp - fight.start_time, config.name)];
        } else {
            return [new PhaseChangeEvent(config.timestamp, config.name)];
        }
    }

    private getDebuffEvents(report: Report, fight: Fight, config: EventConfig, combatEvents: CombatEvent[]): DebuffEvent[] {
        let events = combatEvents.map(
            x => new DebuffEvent(
                x.timestamp - fight.start_time,
                config.friendly,
                this.getCombatEventTarget(x, report).name,
                new Ability(x.ability),
                combatEvents.filter((y, index, array) => y.ability.name == x.ability.name && array.indexOf(y) < array.indexOf(x)).length + 1));

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
