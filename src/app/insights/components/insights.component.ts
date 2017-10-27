import { Component, OnChanges, Input, SimpleChanges } from "@angular/core";
import { MarkupParser } from "app/helpers/markup-parser";
import { Fight, Report } from "app/warcraft-logs/report";
import { FightEvent } from "app/fight-events/models/fight-event";
import { InsightService } from "app/insights/services/insight.service";
import { Insight } from "app/insights/models/insight";
import { InsightConfig } from "app/insights/configs/insight-config";
import { Raid } from "app/raid/raid";
import { InsightContext } from "app/insights/models/insight-context";

@Component({
    selector: 'insights',
    templateUrl: './insights.component.html',
    styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnChanges {

    @Input() report: Report;
    @Input() fight: Fight;
    @Input() raid: Raid;
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
            let context = new InsightContext(this.report, this.fight, this.raid, this.events);
            this.insights = this.insightService.getInsights(this.fight.boss, context);
        }

        this.rows = this.insights.map(x => new InsightTableRow(x));
    }

}

export class InsightTableRow {

    constructor(public insight: Insight) { }

    get hasDetails(): boolean {
        return (this.insight.details && this.insight.details != ".") || (this.insight.tip && this.insight.tip != ".");
    }
    private showDetails = false;

    toggle() {
        if (this.hasDetails) {
            this.showDetails = !this.showDetails;
        }
    }

}
