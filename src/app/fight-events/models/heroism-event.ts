import { FightEvent } from "./fight-event";
import { Ability } from "./ability-event";
import { EventConfig } from "app/event-config/event-config";

export class HeroismEvent extends FightEvent {

    constructor(
        public config: EventConfig,
        public timestamp: number,
        public ability: Ability) {

        super(config, timestamp, true);
    }

    rowClass = "heroism";

    get title(): string {
        return this.ability.name;
    }

}
