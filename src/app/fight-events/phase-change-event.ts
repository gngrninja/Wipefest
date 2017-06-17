import { FightEvent } from "app/fight-events/fight-event";

export class PhaseChangeEvent extends FightEvent {

    constructor(
        public timestamp: number,
        public phase: string) {

        super(timestamp, null);
    }
    
    get title(): string {
        return this.phase + " (" + this.minutesAndSeconds + ")";
    }

}