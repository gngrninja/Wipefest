import { Report, FightInfo } from "app/engine/reports/report";
import { Raid } from "app/engine/raid/raid";
import { FightEvent } from "app/fight-events/models/fight-event";

export class InsightContext {
    constructor(public report: Report, public fightInfo: FightInfo, public raid: Raid, public events: FightEvent[]) { }
}
