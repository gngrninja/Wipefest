import { FightEvent } from "app/fight-events/fight-event";
import { Ability } from "app/fight-events/ability-event";
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