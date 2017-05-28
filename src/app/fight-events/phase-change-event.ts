import { FightEvent } from "app/fight-events/fight-event";

export class PhaseChangeEvent extends FightEvent {

    constructor(
        public timestamp: number,
        public phase: number) {

        super(timestamp, null);
    }
    
    get title(): string {
        return "Phase " + this.phase;
    }

}