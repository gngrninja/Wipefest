import { FightEvent } from "./fight-event";
import { CombatAbility } from "app/warcraft-logs/combat-event";
import { EventConfig } from "app/event-config/event-config";
import { Actor } from "app/warcraft-logs/report";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Ability } from "app/fight-events/models/ability-event";

export class InterruptEvent extends FightEvent {

    constructor(
        public config: EventConfig,
        public timestamp: number,
        public isFriendly: boolean,
        public source: Actor,
        private ability: Ability,
        private sequence: number,
        private target: Actor,
        private showTarget: boolean) {

        super(config, timestamp, isFriendly);
    }

    get title(): string {
        if (this.config.title) return this.config.title;

        if (this.isFriendly) {
            return `${this.source ? `${MarkupHelper.Actor(this.source)} interrupts ` : ''}${this.showTarget ? `${MarkupHelper.Actor(this.target)}'s ` : ''}${MarkupHelper.Ability(this.ability)}${this.frequencyString(this.sequence)}`;
        } else {
            return `${this.showTarget ? `${MarkupHelper.Actor(this.target)}'s ` : ''}${MarkupHelper.Ability(this.ability)}${this.frequencyString(this.sequence)}${this.source ? ` interrupted by ${MarkupHelper.Actor(this.source)}${this.showTarget ? ` ${MarkupHelper.Actor(this.target)}` : ''}` : ''}`;
        }
    }
    get mediumTitle(): string {
        if (this.config.title) return this.config.title;

        return MarkupHelper.Ability(this.ability) + this.frequencyString(this.sequence);
    }
    get shortTitle(): string {
        return this.initials(this.ability.name) + this.frequencyString(this.sequence);
    }
}