import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FightEvent } from 'app/fight-events/models/fight-event';
import { MarkupParser } from 'app/helpers/markup-parser';
import { InsightConfig } from 'app/insights/configs/insight-config';
import { Insight } from 'app/insights/models/insight';
import { InsightContext } from 'app/insights/models/insight-context';
import { InsightService } from 'app/insights/services/insight.service';
import { Raid } from 'app/raid/raid';
import { StateService } from 'app/shared/state.service';
import { Fight, Report } from 'app/warcraft-logs/report';

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

  constructor(
    private insightService: InsightService,
    private stateService: StateService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.calculateInsights();
  }

  calculateInsights() {
    this.insights = [];

    if (this.events.length > 0) {
      const context = new InsightContext(
        this.report,
        this.fight,
        this.raid ? this.raid : new Raid([]),
        this.events
      );
      this.insights = this.insightService.getInsights(this.fight.boss, context);
    }

    this.rows = this.insights.map(
      x => new InsightTableRow(x, this.stateService)
    );
  }
}

export class InsightTableRow {
  constructor(public insight: Insight, private stateService: StateService) {
    this.stateService.changes.subscribe(() => {
      this.showDetails = this.stateService.isInsightSelected(
        this.insight.id,
        this.insight.boss
      );
    });
  }

  get hasDetails(): boolean {
    return this.insight.details != null || this.insight.tip != null;
  }
  private showDetails = false;

  toggle() {
    if (this.hasDetails) {
      this.showDetails = !this.showDetails;
      this.stateService.setInsightSelected(
        this.insight.id,
        this.insight.boss,
        this.showDetails
      );
    }
  }
}
