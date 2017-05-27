import { FightEvent } from "app/fight-events/fight-event";
import { CombatAbility } from "app/warcraft-logs/combat-event";

export class AbilityEvent extends FightEvent {

    constructor(
        public timestamp: number,
        public isFriendly: boolean,
        private source: string,
        private ability: Ability,
        private target: string = null) {

        super(timestamp, isFriendly);
    }

    get title(): string {
        if (this.isFriendly) {
            return this.source + " - " + this.ability.name;
        } else {
            return this.ability.name + " - " + this.source;
        }
    }
    get mediumTitle(): string {
        return this.ability.name;
    }
    get shortTitle(): string {
        return this.initials(this.ability.name);
    }

    private initials(input: string): string {
        return input.split(" ").map(w => w[0]).join("");
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