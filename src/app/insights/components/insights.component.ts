import { Component, OnChanges, Input } from "@angular/core";
import { MarkupHelper } from "app/helpers/markup-helper";
import { MarkupParser } from "app/helpers/markup-parser";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { Fight } from "app/warcraft-logs/report";
import { FightEvent } from "app/fight-events/models/fight-event";
import { InsightService } from "app/insights/services/insight.service";
import { Insight } from "app/insights/models/insight";
import { AvoidableDamageInsightConfig, InsightConfig } from "app/insights/models/insight-config";

@Component({
    selector: 'insights',
    templateUrl: './insights.component.html',
    styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnChanges {

    @Input() fight: Fight;
    @Input() events: FightEvent[];

    configs: InsightConfig[] = [];
    insights: Insight[] = [];
    
    MarkupParser = MarkupParser;

    constructor(private insightService: InsightService) { }

    ngOnChanges() {
        this.configs = [];
        this.insights = [];

        if (this.fight.boss == 2050) { // Sisters of the Moon
            this.configs = [new AvoidableDamageInsightConfig("Glaive Storm")];
        }

        if (this.events.length > 0) {
            this.insights = this.configs.map(x => this.insightService.getInsight(x, this.events));
        }
    }

}
