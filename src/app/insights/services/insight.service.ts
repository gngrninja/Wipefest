import { Injectable } from '@angular/core';
import { Insight } from "app/insights/models/insight";
import { FightEvent } from "app/fight-events/models/fight-event";
import { InsightConfig } from "app/insights/configs/insight-config";
import { TombOfSargerasInsightConfigs } from "app/insights/configs/tomb-of-sargeras/all";
import { AntorusTheBurningThroneInsightConfigs } from "app/insights/configs/antorus-the-burning-throne/all";

@Injectable()
export class InsightService {

    private getInsightConfigs(): InsightConfig[] {
        return [
            ...TombOfSargerasInsightConfigs.All(),
            ...AntorusTheBurningThroneInsightConfigs.All()
        ];
    }

    getInsights(boss: number, events: FightEvent[]): Insight[] {
        return this.getInsightConfigs()
            .filter(x => x.boss == boss)
            .map(x => x.getInsight(events))
            .filter(x => x != null);
    }

}
