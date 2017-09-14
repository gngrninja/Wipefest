import { FightEvent } from "./fight-event";
import { EventConfig } from "app/event-config/event-config";
import { Actor } from "app/warcraft-logs/report";
import { MarkupHelper } from "app/helpers/markup-helper";

export class SpawnEvent extends FightEvent {

    constructor(
        public config: EventConfig,
        public timestamp: number,
        public isFriendly: boolean,
        private actor: Actor,
        private instance: number) {

        super(config, timestamp, isFriendly);
    }

    get title(): string {
        return `${MarkupHelper.Actor(this.actor)}${this.frequencyString(this.instance)} spawned`;
    }
    get mediumTitle(): string {
        return this.title;
    }
    get shortTitle(): string {
        return this.initials(this.actor.name) + this.frequencyString(this.instance);
    }

}
