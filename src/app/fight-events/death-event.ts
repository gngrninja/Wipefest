import { FightEvent } from "app/fight-events/fight-event";
import { CombatAbility } from "app/warcraft-logs/combat-event";
import { Ability } from "app/fight-events/ability-event";

export class DeathEvent extends FightEvent {

    constructor(
        public timestamp: number,
        public isFriendly: boolean,
        private source: string,
        private killingBlow: Ability,
        private from: string) {

        super(timestamp, isFriendly);
    }

    rowClass = "death";

    get title(): string {
        if (this.isFriendly && this.killingBlow) {
            return this.source + " died to " + (this.killingBlow.name == "Melee" ? "melee from " + this.from : this.killingBlow.name);
        } else {
            return this.source + " died";
        }
    }
    get mediumTitle(): string {
        return this.source + " died";
    }
    get shortTitle(): string {
        return this.source;
    }

    get showKillingBlowIcon(): boolean {
        return this.killingBlow && this.killingBlow.guid != 1 // Exclude "Melee"
    }

}