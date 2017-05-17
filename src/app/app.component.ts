import { Component, OnInit } from '@angular/core';
import { WarcraftLogsApiService } from "./warcraft-logs-api/warcraft-logs-api.service";
import { Zone, Encounter } from "./warcraft-logs-api/zone";
import { Ranking } from "./warcraft-logs-api/ranking";
import { CombatEvent } from "./warcraft-logs-api/combat-event";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private zones: Zone[];
  private selectedEncounter: Encounter;

  private rankings: Ranking[];
  private selectedRanking: Ranking;

  private events: CombatEvent[];

  constructor(private warcraftLogsApiService: WarcraftLogsApiService) {}

  ngOnInit() {
    this.warcraftLogsApiService.zones.subscribe(zones => { this.zones = zones; });
    this.warcraftLogsApiService.rankings.subscribe(rankings => this.rankings = rankings);
    this.warcraftLogsApiService.events.subscribe(events => this.events = events);
  }

  private emeraldNightmare() { return this.zones.filter(z => z.id === 10)[0]; }
  private trialOfValor() { return this.zones.filter(z => z.id === 12)[0]; }
  private nighthold() { return this.zones.filter(z => z.id === 11)[0]; }

  private selectEncounter(encounter: Encounter) {
    this.selectedEncounter = encounter;
    this.selectedRanking = null;
    this.rankings = null;
    this.events = null;

    this.warcraftLogsApiService.getRankings(encounter.id, "execution", 5, 2, 20);
  }

  private selectRanking(ranking: Ranking) {
    this.selectedRanking = ranking;
    this.events = null;

    this.warcraftLogsApiService.getReport(ranking.reportID);
    this.warcraftLogsApiService.getEvents(ranking.reportID, 0, ranking.duration, this.getEventFilter());
  }

  private raidCooldownIds = [31821, 62618, 98008, 97462, 64843, 108280, 740, 115310, 15286, 196718, 206222];
  private guldanAbilityIds = [206222, 212258, 209270, 206219, 206221, 206220, 227427, 221783, 211152, 206939, 206744, 167819];

  private getEventFilter(): string {
    const filter = `type = 'cast' and ability.id in (${this.raidCooldownIds.join(", ")}, ${this.guldanAbilityIds.join(", ")})`;

    return filter;
  }

}
