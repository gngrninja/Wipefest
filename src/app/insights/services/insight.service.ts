import { Injectable } from '@angular/core';
import { Insight } from "app/insights/models/insight";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MaidenOfVigilanceInsightConfigs } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/all";
import { InsightConfig } from "app/insights/configs/insight-config";
import { SistersOfTheMoonInsightConfigs } from "app/insights/configs/tomb-of-sargeras/sisters-of-the-moon/all";
import { MistressSasszineInsightConfigs } from "app/insights/configs/tomb-of-sargeras/mistress-sasszine/all";
import { GorothInsightConfigs } from "app/insights/configs/tomb-of-sargeras/goroth/all";
import { DemonicInquisitionInsightConfigs } from "app/insights/configs/tomb-of-sargeras/demonic-inquisition/all";

@Injectable()
export class InsightService {

    private getInsightConfigs(): InsightConfig[] {
        return [
            ...GorothInsightConfigs.All(),
            ...DemonicInquisitionInsightConfigs.All(),
            ...SistersOfTheMoonInsightConfigs.All(),
            ...MistressSasszineInsightConfigs.All(),
            ...MaidenOfVigilanceInsightConfigs.All()
        ];
    }

    getInsights(boss: number, events: FightEvent[]): Insight[] {
        return this.getInsightConfigs()
            .filter(x => x.boss == boss)
            .map(x => x.getInsight(events))
            .filter(x => x != null);
    }

}
