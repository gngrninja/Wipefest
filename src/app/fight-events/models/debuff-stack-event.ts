import { FightEvent } from "./fight-event";
import { CombatAbility } from "app/warcraft-logs/combat-event";
import { Ability } from "./ability-event";
import { EventConfig } from "app/event-config/event-config";
import { Actor } from "app/warcraft-logs/report";
import { MarkupHelper } from "app/helpers/markup-helper";

export class DebuffStackEvent extends FightEvent {

    constructor(
        public config: EventConfig,
        public timestamp: number,
        public isFriendly: boolean,
        public target: Actor,
        public source: Actor,
        private showSource: boolean,
        public ability: Ability,
        public stack: number,
        public sequence: number) {

        super(config, timestamp, isFriendly);
    }

    get title(): string {
        if (this.config.title) return this.config.title;

        if (this.isFriendly) {
            return `${MarkupHelper.Actor(this.target)} gains ${this.stack} ${MarkupHelper.Ability(this.ability)}${this.showSource ? ` from ${MarkupHelper.Actor(this.source)}` : ''}`;
        } else {
            return `${this.stack} ${MarkupHelper.Ability(this.ability)} applied to ${MarkupHelper.Actor(this.target)}${this.showSource ? ` from ${MarkupHelper.Actor(this.source)}` : ''}`;
        }
    }
    get mediumTitle(): string {
        if (this.config.title) return this.config.title;

        return `${this.stack} ${MarkupHelper.Ability(this.ability)}`;
    }
    get shortTitle(): string {
        return `${this.stack} ${this.initials(this.ability.name)}`;
    }

}
