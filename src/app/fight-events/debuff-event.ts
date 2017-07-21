import { FightEvent } from "app/fight-events/fight-event";
import { CombatAbility } from "app/warcraft-logs/combat-event";
import { Ability } from "app/fight-events/ability-event";
import { EventConfig } from "app/event-config/event-config";

export class DebuffEvent extends FightEvent {

    constructor(
        public config: EventConfig,
        public timestamp: number,
        public isFriendly: boolean,
        private source: string,
        private ability: Ability,
        public sequence: number,
        private target: string = null) {

        super(config, timestamp, isFriendly);
    }

    get title(): string {
        if (this.isFriendly) {
            return this.source + " gains " + this.ability.name + " (" + this.sequence + ")";
        } else {
            return this.ability.name + " (" + this.sequence + ")" + " applied to " + this.source;
        }
    }
    get mediumTitle(): string {
        return this.ability.name + " (" + this.sequence + ")";
    }
    get shortTitle(): string {
        return this.initials(this.ability.name) + " (" + this.sequence + ")";
    }

}