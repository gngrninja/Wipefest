import { FightEvent } from "./fight-event";
import { CombatAbility } from "app/warcraft-logs/combat-event";
import { Ability } from "./ability-event";
import { EventConfig } from "app/event-config/event-config";
import { Report, Fight } from "app/warcraft-logs/report";

export class DeathEvent extends FightEvent {

    constructor(
        public config: EventConfig,
        private index: number,
        private report: Report,
        private fight: Fight,
        public timestamp: number,
        public isFriendly: boolean,
        private source: string,
        private killingBlow: Ability,
        private from: string,
        private deathWindow: number,
        private damageTaken: number,
        private healingReceived: number,
        public childEvents: FightEvent[]) {

        super(config, timestamp, isFriendly, childEvents);
    }

    rowClass = "death";

    get title(): string {
        if (this.isFriendly && this.killingBlow) {
            return this.source +
                (this.deathWindow == 0 ? " one-shot by " : " died to ") +
                (this.killingBlow.name == "Melee" ? "melee from " + this.from : this.killingBlow.name);
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

    private get deathWindowInSeconds() {
        return (Math.round(this.deathWindow / 100)) / 10;
    }
    private get damageTakenInMillions() {
        return (Math.round(this.damageTaken / 100000)) / 10;
    }
    private get healingReceivedInMillions() {
        return (Math.round(this.healingReceived / 100000)) / 10;
    }

    get details(): string {
        let details = "";

        if (this.deathWindow == 0) {
            details = `Took {[style="danger"] ${this.damageTakenInMillions}m} damage.`
        } else {
            details = `Died over {[style="warning"] ${this.deathWindowInSeconds}} seconds. Took {[style="danger"] ${this.damageTakenInMillions}m} damage, and received {[style="success"] ${this.healingReceivedInMillions}m} healing.`;
        }

        details += ` {[url="https://www.warcraftlogs.com/reports/${this.report.id}#fight=${this.fight.id}&type=deaths&death=${this.index + 1}"] Warcraft Logs}.`;

        return details;
    }

    get showKillingBlowIcon(): boolean {
        return this.killingBlow && this.killingBlow.guid != 1 // Exclude "Melee"
    }

}
