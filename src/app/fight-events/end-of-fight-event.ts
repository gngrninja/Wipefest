import { FightEvent } from "app/fight-events/fight-event";
import { EventConfig } from "app/event-config/event-config";

export class EndOfFightEvent extends FightEvent {

    constructor(
        public timestamp: number,
        public kill: boolean) {

        super(null, timestamp, null);
    }
    
    get title(): string {
        return `${this.kill ? "Kill" : "Wipe"} (${this.minutesAndSeconds})`;
    }

}