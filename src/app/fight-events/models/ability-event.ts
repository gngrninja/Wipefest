import { FightEvent } from "./fight-event";
import { CombatAbility } from "app/warcraft-logs/combat-event";
import { EventConfig } from "app/event-config/event-config";

export class AbilityEvent extends FightEvent {

    constructor(
        public config: EventConfig,
        public timestamp: number,
        public isFriendly: boolean,
        private source: string,
        private ability: Ability,
        private sequence: number,
        private target: string = null,
        private showTarget: boolean = false,) {

        super(config, timestamp, isFriendly);
    }

    get title(): string {
        if (this.isFriendly) {
            return `${this.source ? `${this.source} casts ` : ''}${this.ability.name}${this.frequencyString(this.sequence)}${this.showTarget ? ` on ${this.target}` : ''}`;
        } else {
            return `${this.ability.name}${this.frequencyString(this.sequence)}${this.source ? ` cast by ${this.source}` : ''}`;
        }
    }
    get mediumTitle(): string {
        return this.ability.name + this.frequencyString(this.sequence);
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
