import { FightEvent } from "./fight-event";
import { CombatAbility } from "app/warcraft-logs/combat-event";
import { Ability } from "./ability-event";
import { EventConfig } from "app/event-config/event-config";
import { Actor } from "app/warcraft-logs/report";
import { MarkupHelper } from "app/helpers/markup-helper";

export class DebuffEvent extends FightEvent {

    constructor(
        public config: EventConfig,
        public timestamp: number,
        public isFriendly: boolean,
        private source: Actor,
        private ability: Ability,
        public sequence: number) {

        super(config, timestamp, isFriendly);
    }

    get title(): string {
        if (this.isFriendly) {
            if (this.config.filter.stack) {
                return `${MarkupHelper.Actor(this.source)} gains ${this.config.filter.stack} ${MarkupHelper.Ability(this.ability)}`;
            }
            return `${MarkupHelper.Actor(this.source)} gains ${MarkupHelper.Ability(this.ability)}${this.frequencyString(this.sequence)}`;
        } else {
            if (this.config.filter.stack) {
                return `${this.config.filter.stack} ${MarkupHelper.Ability(this.ability)} applied to ${MarkupHelper.Actor(this.source)}`;
            }
            return `${MarkupHelper.Ability(this.ability)}${this.frequencyString(this.sequence)} applied to ${MarkupHelper.Actor(this.source)}`;
        }
    }
    get mediumTitle(): string {
        if (this.config.filter.stack) {
            return `${this.config.filter.stack} ${MarkupHelper.Ability(this.ability)}`;
        }
        return MarkupHelper.Ability(this.ability) + this.frequencyString(this.sequence);
    }
    get shortTitle(): string {
        if (this.config.filter.stack) {
            return `${this.config.filter.stack} ${this.initials(this.ability.name)}`;
        }
        return this.initials(this.ability.name) + this.frequencyString(this.sequence);
    }

}
