import { Injectable } from '@angular/core';
import { EventConfig } from "app/event-config/event-config";
import { FightEvent } from "app/fight-events/fight-event";
import { CombatEvent } from "app/warcraft-logs/combat-event";
import { AbilityEvent, Ability } from "app/fight-events/ability-event";
import { Fight, Report } from "app/warcraft-logs/report";
import { PhaseChangeEvent } from "app/fight-events/phase-change-event";

@Injectable()
export class EventService {

    getEvents(report: Report, fight: Fight, config: EventConfig, combatEvents: CombatEvent[]): FightEvent[] {
        switch (config.eventType) {
            case "ability":
                return this.getAbilityEvents(report, fight, config, combatEvents);
            case "phase":
                return this.getPhaseChangeEvents(fight, config, combatEvents);
            default: {
                throw new Error(`'${config.eventType}' is an unsupported event type`);
            }
        }
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

    private getCombatEventSource(event: CombatEvent, report: Report) {
        if (event.sourceIsFriendly) {
            return report.friendlies.filter(x => x.id === event.sourceID)[0];
        } else {
            if (event.type == "applydebuff" && event.targetIsFriendly) {
                return report.friendlies.filter(x => x.id === event.targetID)[0];
            } else {
                return report.enemies.filter(x => x.id === event.sourceID)[0];
            }
        }
    }

}
