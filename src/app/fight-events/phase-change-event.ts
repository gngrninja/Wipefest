import { FightEvent } from "app/fight-events/fight-event";
import { EventConfig } from "app/event-config/event-config";

export class PhaseChangeEvent extends FightEvent {

    show = true;

    constructor(
        public config: EventConfig,
        public timestamp: number,
        public phase: string) {

        super(config, timestamp, null);
    }
    
    get title(): string {
        return this.phase + " (" + this.minutesAndSeconds + ")";
    }

}
