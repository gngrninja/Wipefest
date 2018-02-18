import { Player } from "app/engine/raid/raid";

export class TimestampAndPlayers {

    constructor(public timestamp: number, public players: Player[]) { }

}
