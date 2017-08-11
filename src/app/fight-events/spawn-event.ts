import { FightEvent } from "app/fight-events/fight-event";
import { EventConfig } from "app/event-config/event-config";

export class SpawnEvent extends FightEvent {

    constructor(
        public config: EventConfig,
        public timestamp: number,
        public isFriendly: boolean,
        private name: string,
        private instance: number) {

        super(config, timestamp, isFriendly);
    }

    get title(): string {
        return `${this.name}${this.frequencyString(this.instance)} spawned`;
    }
    get mediumTitle(): string {
        return this.title;
    }
    get shortTitle(): string {
        return this.initials(this.name) + this.frequencyString(this.instance);
    }

}