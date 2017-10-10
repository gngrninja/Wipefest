import { Component, OnChanges, Input, AfterViewInit, SimpleChanges } from "@angular/core";
import { MarkupHelper } from "app/helpers/markup-helper";
import { MarkupParser } from "app/helpers/markup-parser";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { Fight } from "app/warcraft-logs/report";
import { FightEvent } from "app/fight-events/models/fight-event";
import { InsightService } from "app/insights/services/insight.service";
import { Insight } from "app/insights/models/insight";
import { AvoidableDamageInsightConfig, InsightConfig, CustomInsightConfig } from "app/insights/models/insight-config";
import { DeathEvent } from "app/fight-events/models/death-event";

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
        //this.configs = [];
        this.insights = [];

        //if (this.fight.boss == 2050) { // Sisters of the Moon
        //    this.configs = [
        //        new CustomInsightConfig("Twilight Glaive"),
        //        new AvoidableDamageInsightConfig("Glaive Storm", `
        //              ${MarkupHelper.Style("arcane", "Glaive Storm")} is cast by ${MarkupHelper.Style("boss", "Huntress Kasparian")},
        //              so watch her position before it casts (be aware that she might teleport just before she casts it).
        //              When ${MarkupHelper.Style("arcane", "Glaive Storm")} reaches the edge of the room, it splits into 3 smaller glaives that bounce back.
        //              When these smaller glaives reach the edge of the room, they each split into 3 even smaller glaives that bounce back.
        //              This is the hardest part of this ability. The enrage timer is not usually an issue in this encounter,
        //              so, if necessary, be sure to focus more on your dodging than your throughput.
        //              Sometimes, ${MarkupHelper.Style("arcane", "Twilight Glaive")} can overlap with the end of ${MarkupHelper.Style("arcane", "Glaive Storm")},
        //              so pay attention to the positioning for that as well.
        //              Once all of the glaives have passed, you can usually move back into your regular position.`),
        //        new CustomInsightConfig("Astral Vulnerability"),
        //        new CustomInsightConfig("Moon Burn")
        //    ];
        //}

        //if (this.fight.boss == 2052) { // Maiden of Vigilance
        //    this.configs = [
        //        new CustomInsightConfig("Unstable Soul Gains"),
        //        new CustomInsightConfig("Echoes"),
        //        new CustomInsightConfig("Unstable Soul Gains From Echoes"),
        //        new CustomInsightConfig("Unstable Soul Full Expiration Explosion"),
        //        new CustomInsightConfig("Unstable Soul Early Expiration Explosion"),
        //        new CustomInsightConfig("Orbs"),
        //        new CustomInsightConfig("Creator's Grace"),
        //        new CustomInsightConfig("Died From Falling"),
        //        new CustomInsightConfig("Phase Two Duration")
        //    ];
        //}

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
