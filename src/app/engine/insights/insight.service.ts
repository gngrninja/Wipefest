import { Injectable } from '@angular/core';
import { FightEvent } from "app/fight-events/models/fight-event";
import { InsightConfig } from 'app/engine/insights/configs/insight-config';
import { InsightContext } from 'app/engine/insights/models/insight-context';
import { TombOfSargerasInsightConfigs } from 'app/engine/insights/configs/tomb-of-sargeras/all';
import { AntorusTheBurningThroneInsightConfigs } from 'app/engine/insights/configs/antorus-the-burning-throne/all';
import { Insight } from 'app/engine/insights/models/insight';

@Injectable()
export class InsightService {

    private getInsightConfigs(): InsightConfig[] {
        return [
            ...TombOfSargerasInsightConfigs.All(),
            ...AntorusTheBurningThroneInsightConfigs.All()
        ];
    }

    getInsights(boss: number, context: InsightContext): Insight[] {
        return this.getInsightConfigs()
            .filter(x => x.boss == boss)
            .map(x => x.getInsight(context))
            .filter(x => x != null);
    }

}
