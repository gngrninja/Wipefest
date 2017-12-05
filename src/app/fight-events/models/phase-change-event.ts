import { FightEvent } from "./fight-event";
import { EventConfig } from "app/event-config/event-config";

export class PhaseChangeEvent extends FightEvent {
  
    constructor(
        public config: EventConfig,
        public timestamp: number,
        public phase: string,
        public show = true) {

        super(config, timestamp, null);
    }
    
    get title(): string {
        return this.phase + " (" + this.minutesAndSeconds + ")";
    }

}
