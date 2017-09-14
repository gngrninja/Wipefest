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
        private ability: Ability,
        private damage: number,
        private absorbed: number,
        private overkill: number) {

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
        return `${this.ability.name} (${this.damageText})${this.source && this.isFriendly ? ` from ${MarkupHelper.Actor(this.source)}` : ""}`
    }

    get title(): string {
        if (this.isFriendly) {
            return `${this.ability.name} (${this.damageText})${this.source ? ` from ${MarkupHelper.Actor(this.source)}` : ""}`;
        } else {
            return `${this.ability.name} (${this.damageText})`;
        }
    }
    get mediumTitle(): string {
        if (this.isFriendly) {
            return `${this.ability.name} (${this.damage}) from ${MarkupHelper.Actor(this.source)}`;
        } else {
            return `${this.ability.name} (${this.damage})`;
        }
    }
    get shortTitle(): string {
        return `${this.initials(this.ability.name)} (${this.damage})`;
    }

}
