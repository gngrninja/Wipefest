import { FightEvent } from "./fight-event";
import { EventConfig } from "app/event-config/event-config";
import { Ability } from "./ability-event";
import { Actor } from "app/warcraft-logs/report";
import { MarkupHelper } from "app/helpers/markup-helper";

export class DamageEvent extends FightEvent {

    constructor(
        public config: EventConfig,
        public timestamp: number,
        public isFriendly: boolean,
        private source: Actor,
        public target: Actor,
        public ability: Ability,
        private damage: number,
        private absorbed: number,
        private overkill: number,
        private isChild: boolean) {

        super(config, timestamp, isFriendly);
    }

    get damageText(): string {
        let text = `{[style="danger"] ${this.damage}}`;
        if (this.absorbed > 0)
            text += `, A: {[style="info"] ${this.absorbed}}`;
        if (this.overkill > 0)
            text += `, O: {[style="warning"] ${this.overkill}}`;

        return text;
    }

    get tableTitle(): string {
        return this.title;
    }

    get title(): string {
        if (this.config.title) return this.config.title;

        let title = `${MarkupHelper.Ability(this.ability)} (${this.damageText})${this.source && this.isFriendly ? ` from ${MarkupHelper.Actor(this.source)}` : ""}`;
        if (!this.isChild) {
            title = `${MarkupHelper.Actor(this.target)} damaged by ` + title;
        }

        return title;
    }
    get mediumTitle(): string {
        if (this.config.title) return this.config.title;

        let title = `${MarkupHelper.Ability(this.ability)}${this.source && this.isFriendly ? ` from ${MarkupHelper.Actor(this.source)}` : ""}`;
        if (!this.isChild) {
            title = `${MarkupHelper.Actor(this.target)} damaged by ` + title;
        }

        return title;
    }
    get shortTitle(): string {
        return `${this.initials(this.ability.name)} ({[style="danger"] ${this.damage}})`;
    }

}
