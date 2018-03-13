import { EventConfig } from "app/event-config/event-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { InsightConfig } from "app/insights/configs/insight-config";
import { Report, FightInfo } from "app/engine/reports/report";
import { Raid } from "app/raid/raid";
import { Insight} from "../insights/models/insight";

export class Fight {

    constructor(
        public report: Report,
        public info: FightInfo,
        public raid: Raid,
        public eventConfigs: EventConfig[],
        public events: FightEvent[],
        public insights: Insight[]) { }

}
