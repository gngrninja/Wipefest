import { Report, Fight } from "app/warcraft-logs/report";
import { Raid } from "app/raid/raid";
import { FightEvent } from "app/fight-events/models/fight-event";

export class InsightContext {
    constructor(public report: Report, public fight: Fight, public raid: Raid, public events: FightEvent[]) { }
}
