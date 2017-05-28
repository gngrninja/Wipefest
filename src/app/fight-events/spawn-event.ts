import { FightEvent } from "app/fight-events/fight-event";

export class SpawnEvent extends FightEvent {

    constructor(
        public timestamp: number,
        public isFriendly: boolean,
        private name: string,
        private instance: number) {

        super(timestamp, isFriendly);
    }

    get title(): string {
        return this.name + " (" + this.instance + ") " + "spawned";
    }
    get mediumTitle(): string {
        return this.title;
    }
    get shortTitle(): string {
        return this.initials(this.name) + " (" + this.instance + ")";
    }

}