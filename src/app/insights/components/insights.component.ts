import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MarkupParser } from 'app/helpers/markup-parser';
import { StateService } from 'app/shared/state.service';
import {
  Insight,
  InsightIntervalUnit
} from '@wipefest/api-sdk/dist/lib/models';

@Component({
  selector: 'insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnChanges {
  @Input() insights: Insight[] = [];
  rows: InsightTableRow[] = [];

  MarkupParser: any = MarkupParser;

  constructor(private stateService: StateService) {
    this.stateService.changes.subscribe(() => {
      this.setInsightRows();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setInsightRows();
  }

  setInsightRows(): void {
    const ignore = this.stateService.ignore;
    const deathThreshold = this.stateService.deathThreshold || 2;
    const totalDeaths = Math.max(
      ...this.insights
        .filter(x => x.interval.unit === InsightIntervalUnit.Death)
        .map(x => x.interval.endUnit)
    );

    this.rows = this.insights
      .filter(x => {
        if (!ignore || deathThreshold > totalDeaths)
          return x.interval.unit === InsightIntervalUnit.EntireFight;

        return (
          x.interval.unit === InsightIntervalUnit.Death &&
          x.interval.startUnit === 0 &&
          x.interval.endUnit === Math.min(deathThreshold, totalDeaths)
        );
      })
      .map(x => new InsightTableRow(x, this.stateService));
  }
}

export class InsightTableRow {
  showDetails: boolean = false;

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

  toggle(): void {
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
