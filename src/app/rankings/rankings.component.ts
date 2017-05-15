import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Ranking } from "../warcraft-logs-api/ranking";

@Component({
  selector: 'rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.css']
})
export class RankingsComponent {

  @Input()
  rankings: Ranking;

  @Output()
  rankingEmitter: EventEmitter<Ranking> = new EventEmitter<Ranking>();

  private selectRanking(ranking: Ranking) {
    this.rankingEmitter.emit(ranking);
  }

}
