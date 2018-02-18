import { Actor } from "app/engine/reports/report";

export class PlayerAndDamage {

    constructor(public player: Actor, public damage: number, public absorbed: number, public overkill: number) { }

}
