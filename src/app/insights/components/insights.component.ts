import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MarkupParser } from 'app/helpers/markup-parser';
import { StateService } from 'app/shared/state.service';
import { Insight } from '@wipefest/api-sdk/dist/lib/models';

@Component({
  selector: 'insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnChanges {
  @Input() insights: Insight[] = [];
  rows: InsightTableRow[] = [];

  MarkupParser: any = MarkupParser;

  constructor(private stateService: StateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.setInsightRows();
  }

  setInsightRows(): void {
    this.rows = this.insights.map(
      x => new InsightTableRow(x, this.stateService)
    );
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
