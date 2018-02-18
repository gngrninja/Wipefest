import { Actor } from "app/engine/reports/report";
import { Ability } from "app/fight-events/models/ability-event";

export class PlayerAndAbility {

    constructor(public player: Actor, public ability: Ability) { }

}
