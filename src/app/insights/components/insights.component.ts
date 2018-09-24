import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StateService } from 'app/shared/state.service';
import {
  Insight,
  InsightIntervalUnit,
  InsightConfig,
  InsightStatistic
} from '@wipefest/api-sdk/dist/lib/models';
import { MarkupParser } from '@wipefest/core';

@Component({
  selector: 'insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnChanges {
  @Input() insights: Insight[] = [];
  @Input() insightConfigs: InsightConfig[] = [];
  @Input() trackState: boolean = true;
  rows: InsightTableRow[] = [];

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
      .map(
        x =>
          new InsightTableRow(
            x,
            this.insightConfigs.find(c => c.id == x.id && c.group == x.group),
            this.trackState ? this.stateService : null
          )
      );
  }

  parse(markup: string): string {
    return MarkupParser.Parse(markup, MarkupParser.RuleSets.html);
  }
}

export class InsightTableRow {
  showDetails: boolean = false;
  percentile: number;
  percentileStyle: string;
  statistics: InsightStatistic[] = [];

  constructor(
    public insight: Insight,
    private config: InsightConfig,
    private stateService: StateService
  ) {
    if (this.stateService) {
      this.stateService.changes.subscribe(() => {
        this.showDetails = this.stateService.isInsightSelected(
          this.insight.id,
          this.insight.group
        );

        if (config.statistics) {
          const mainStatistic = insight.statistics.find(
            s => s.name === config.mainStatistic
          );

          if (mainStatistic) {
            this.percentile = mainStatistic.percentile;
            this.percentileStyle =
              'markup-' + this.rankingQuality(this.percentile);
          }

          this.statistics = insight.statistics.filter(s =>
            config.statistics.some(c => c.name === s.name)
          );
        }
      });
    }
  }

  get hasDetails(): boolean {
    return this.insight.details != null || this.insight.tip != null;
  }

  toggle(): void {
    if (this.hasDetails) {
      this.showDetails = !this.showDetails;

      if (this.stateService) {
        this.stateService.setInsightSelected(
          this.insight.id,
          this.insight.group,
          this.showDetails
        );
      }
    }
  }

  rankingQuality(percent: number): string {
    return percent === 100
      ? 'artifact'
      : percent >= 95
        ? 'legendary'
        : percent >= 75
          ? 'epic'
          : percent >= 50
            ? 'rare'
            : percent >= 25
              ? 'uncommon'
              : 'common';
  }
}
