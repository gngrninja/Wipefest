import { FightEvent } from "./fight-event";
import { CombatAbility } from "app/warcraft-logs/combat-event";
import { EventConfig } from "app/event-config/event-config";
import { Actor } from "app/warcraft-logs/report";
import { MarkupHelper } from "app/helpers/markup-helper";

export class AbilityEvent extends FightEvent {

    constructor(
        public config: EventConfig,
        public timestamp: number,
        public isFriendly: boolean,
        private source: Actor,
        private ability: Ability,
        private sequence: number,
        private target: Actor,
        private showTarget: boolean) {

        super(config, timestamp, isFriendly);
    }

    get title(): string {
        if (this.config.title) return this.config.title;

        if (this.isFriendly) {
            return `${this.source ? `${MarkupHelper.Actor(this.source)} casts ` : ''}${MarkupHelper.Ability(this.ability)}${this.frequencyString(this.sequence)}${this.showTarget ? ` on ${MarkupHelper.Actor(this.target)}` : ''}`;
        } else {
            return `${MarkupHelper.Ability(this.ability)}${this.frequencyString(this.sequence)}${this.source ? ` cast by ${MarkupHelper.Actor(this.source)}` : ''}`;
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

export class Ability {

    name: string;
    type: number;
    guid: number;
    abilityIcon: string;

    constructor(combatAbility: CombatAbility) {
        this.name = combatAbility.name;
        this.type = combatAbility.type;
        this.guid = combatAbility.guid;
        this.abilityIcon = combatAbility.abilityIcon;
    }

    get iconUrl(): string {
        return `https://www.warcraftlogs.com/img/icons/abilities/${this.abilityIcon}`;
    }

    get url(): string {
        return `http://wowhead.com/spell=${this.guid}`;
    }

}
