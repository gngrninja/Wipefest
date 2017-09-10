import { FightEvent } from "./fight-event";
import { EventConfig } from "app/event-config/event-config";
import { Ability } from "./ability-event";

export class DamageEvent extends FightEvent {

    constructor(
        public config: EventConfig,
        public timestamp: number,
        public isFriendly: boolean,
        private source: string,
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
        return `(${this.damageText}) ${this.ability.name}${this.source && this.isFriendly ? ` from ${this.source}` : ""}`
    }

    get title(): string {
        if (this.isFriendly) {
            return `(${this.damageText}) ${this.ability.name}${this.source ? ` from ${this.source}` : ""}`;
        } else {
            return `${this.ability.name} (${this.damageText})`;
        }
    }
    get mediumTitle(): string {
        if (this.isFriendly) {
            return `(${this.damage}) ${this.ability.name} from ${this.source}`;
        } else {
            return `${this.ability.name} (${this.damage})`;
        }
    }
    get shortTitle(): string {
        if (this.isFriendly) {
            return `(${this.damage}) ${this.initials(this.ability.name)}`;
        } else {
            return `${this.initials(this.ability.name)} (${this.damage})`;
        }
    }

}
