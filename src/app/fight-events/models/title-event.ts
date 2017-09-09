import { FightEvent } from "./fight-event";
import { EventConfig } from "app/event-config/event-config";

export class TitleEvent extends FightEvent {

    constructor(
        public timestamp: number,
        public text: string) {

        super(null, timestamp, null);
    }
    
    get title(): string {
        return `${this.text} (${this.minutesAndSeconds})`;
    }

}
