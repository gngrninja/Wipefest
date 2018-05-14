import { Component, Input } from '@angular/core';
import { MarkupHelper } from 'app/helpers/markup-helper';
import { MarkupParser } from 'app/helpers/markup-parser';
import { SelectedFocus, StateService } from 'app/shared/state.service';
import { RaidDto, Player, Report } from '@wipefest/api-sdk/dist/lib/models';

@Component({
  selector: 'fight-summary-raid',
  templateUrl: './fight-summary-raid.component.html',
  styleUrls: ['./fight-summary-raid.component.scss']
})
export class FightSummaryRaidComponent {
  MarkupHelper: any = MarkupHelper;
  MarkupParser: any = MarkupParser;

  @Input() report: Report;
  @Input() raid: RaidDto;

  get tanks(): Player[] {
    return this.raid.players.filter(
      x => x.specialization && x.specialization.role === 'Tank'
    );
  }
  get healers(): Player[] {
    return this.raid.players.filter(
      x => x.specialization && x.specialization.role === 'Healer'
    );
  }
  get ranged(): Player[] {
    return this.raid.players.filter(
      x => x.specialization && x.specialization.role === 'Ranged'
    );
  }
  get melee(): Player[] {
    return this.raid.players.filter(
      x => x.specialization && x.specialization.role === 'Melee'
    );
  }
  get roles(): RoleWithPlayers[] {
    return [
      new RoleWithPlayers('Tanks', this.tanks),
      new RoleWithPlayers('Healers', this.healers),
      new RoleWithPlayers('Ranged', this.ranged),
      new RoleWithPlayers('Melee', this.melee)
    ];
  }

  showAllFocuses: boolean = window.location.href.indexOf('www.wipefest.net') === -1;
  private focuses: SelectedFocus[] = [];

  constructor(private stateService: StateService) {
    this.stateService.changes.subscribe(
      () => (this.focuses = this.stateService.focuses)
    );
  }

  isFocused(player: Player): boolean {
    const friendly = this.report.friendlies.find(x => x.name === player.name);
    return friendly
      ? this.focuses.some(focus => focus.id === friendly.id.toString())
      : false;
  }

  toggleFocus(player: Player): void {
    const friendly = this.report.friendlies.find(x => x.name === player.name);
    if (this.isFocused(player)) {
      this.focuses = this.focuses.filter(
        focus => focus.id !== friendly.id.toString()
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

  clearFocus(): void {
    this.focuses = [];
    this.stateService.focuses = this.focuses;
  }
}

export class RoleWithPlayers {
  constructor(public name: string, public players: Player[]) {}
}
