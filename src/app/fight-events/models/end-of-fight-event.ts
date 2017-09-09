import { TitleEvent } from "./title-event";
import { EventConfig } from "app/event-config/event-config";

export class EndOfFightEvent extends TitleEvent {

    constructor(
        public timestamp: number,
        public kill: boolean) {

        super(timestamp, kill ? "Kill" : "Wipe");
    }

}
