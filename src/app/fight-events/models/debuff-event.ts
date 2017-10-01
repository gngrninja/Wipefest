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
        public target: Actor,
        public source: Actor,
        private showSource: boolean,
        public ability: Ability,
        public sequence: number) {

        super(config, timestamp, isFriendly);
    }

    get title(): string {
        if (this.config.title) return this.config.title;

        if (this.isFriendly) {
            if (this.config.filter.stack) {
                return `${MarkupHelper.Actor(this.target)} gains ${this.config.filter.stack} ${MarkupHelper.Ability(this.ability)}${this.showSource ? ` from ${MarkupHelper.Actor(this.source)}` : ''}`;
            }
            return `${MarkupHelper.Actor(this.target)} gains ${MarkupHelper.Ability(this.ability)}${this.frequencyString(this.sequence)}${this.showSource ? ` from ${MarkupHelper.Actor(this.source)}` : ''}`;
        } else {
            if (this.config.filter.stack) {
                return `${this.config.filter.stack} ${MarkupHelper.Ability(this.ability)} applied to ${MarkupHelper.Actor(this.target)}${this.showSource ? ` from ${MarkupHelper.Actor(this.source)}` : ''}`;
            }
            return `${MarkupHelper.Ability(this.ability)}${this.frequencyString(this.sequence)} applied to ${MarkupHelper.Actor(this.target)}${this.showSource ? ` from ${MarkupHelper.Actor(this.source)}` : ''}`;
        }
    }
    get mediumTitle(): string {
        if (this.config.title) return this.config.title;

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
