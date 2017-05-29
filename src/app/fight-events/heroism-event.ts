import { FightEvent } from "app/fight-events/fight-event";
import { Ability } from "app/fight-events/ability-event";

export class HeroismEvent extends FightEvent {

    constructor(
        public timestamp: number,
        public ability: Ability) {

        super(timestamp, true);
    }

    rowClass = "heroism";

    get title(): string {
        return this.ability.name;
    }

}