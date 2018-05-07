import { Component, Input } from '@angular/core';
import { MarkupHelper } from 'app/helpers/markup-helper';
import { MarkupParser } from 'app/helpers/markup-parser';
import { Player, Raid } from 'app/raid/raid';
import { SelectedFocus, StateService } from 'app/shared/state.service';
import { Report } from 'app/warcraft-logs/report';

@Component({
  selector: 'fight-summary-raid',
  templateUrl: './fight-summary-raid.component.html',
  styleUrls: ['./fight-summary-raid.component.scss']
})
export class FightSummaryRaidComponent {
  MarkupHelper = MarkupHelper;
  MarkupParser = MarkupParser;

  @Input() report: Report;
  @Input() raid: Raid;

  private focuses: SelectedFocus[] = [];
  showAllFocuses = window.location.href.indexOf('www.wipefest.net') == -1;

  constructor(private stateService: StateService) {
    this.stateService.changes.subscribe(
      () => (this.focuses = this.stateService.focuses)
    );
  }

  isFocused(player: Player): boolean {
    const friendly = this.report.friendlies.find(
      friendly => friendly.name == player.name
    );
    return friendly
      ? this.focuses.some(focus => focus.id == friendly.id.toString())
      : false;
  }

  toggleFocus(player: Player) {
    const friendly = this.report.friendlies.find(
      friendly => friendly.name == player.name
    );
    if (this.isFocused(player)) {
      this.focuses = this.focuses.filter(
        focus => focus.id != friendly.id.toString()
      );
    } else {
      this.focuses.push(
        new SelectedFocus(friendly.id.toString(), [
          player.specialization.include,
          player.specialization.generalInclude
        ])
      );
    }
    this.stateService.focuses = this.focuses;
  }

  clearFocus() {
    this.focuses = [];
    this.stateService.focuses = this.focuses;
  }
}
