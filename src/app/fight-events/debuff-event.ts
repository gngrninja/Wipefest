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
        public sequence: number) {

        super(config, timestamp, isFriendly);
    }

    get title(): string {
        if (this.isFriendly) {
            if (this.config.filter.stack) {
                return `${this.source} gains ${this.config.filter.stack} ${this.ability.name}`;
            }
            return `${this.source} gains ${this.ability.name}${this.frequencyString(this.sequence)}`;
        } else {
            if (this.config.filter.stack) {
                return `${this.config.filter.stack} ${this.ability.name} applied to ${this.source}`;
            }
            return `${this.ability.name}${this.frequencyString(this.sequence)} applied to ${this.source}`;
        }
    }
    get mediumTitle(): string {
        if (this.config.filter.stack) {
            return `${this.config.filter.stack} ${this.ability.name}`;
        }
        return this.ability.name + this.frequencyString(this.sequence);
    }
    get shortTitle(): string {
        if (this.config.filter.stack) {
            return `${this.config.filter.stack} ${this.initials(this.ability.name)}`;
        }
        return this.initials(this.ability.name) + this.frequencyString(this.sequence);
    }

}