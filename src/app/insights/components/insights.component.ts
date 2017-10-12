import { Component, OnChanges, Input, SimpleChanges } from "@angular/core";
import { MarkupParser } from "app/helpers/markup-parser";
import { Fight } from "app/warcraft-logs/report";
import { FightEvent } from "app/fight-events/models/fight-event";
import { InsightService } from "app/insights/services/insight.service";
import { Insight } from "app/insights/models/insight";
import { InsightConfig } from "app/insights/configs/insight-config";

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
    rows: InsightTableRow[] = [];

    MarkupParser = MarkupParser;

    constructor(private insightService: InsightService) { }

    ngOnChanges(changes: SimpleChanges) {
        this.calculateInsights();
    }

    calculateInsights() {
        this.insights = [];

        if (this.events.length > 0) {
            this.insights = this.insightService.getInsights(this.fight.boss, this.events);
        }

        this.rows = this.insights.map(x => new InsightTableRow(x));
    }

}

export class InsightTableRow {

    constructor(public insight: Insight) { }

    private showDetails = false;

    toggle() {
        this.showDetails = !this.showDetails;
    }

}
