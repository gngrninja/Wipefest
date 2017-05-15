import { Component, Input, OnInit } from '@angular/core';
import { CombatEvent } from "../warcraft-logs-api/combat-event"
import { WarcraftLogsApiService } from "../warcraft-logs-api/warcraft-logs-api.service";
import { Report } from "../warcraft-logs-api/report";

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  @Input()
  events: CombatEvent[];

  report: Report;

  constructor(private warcraftLogsApiService: WarcraftLogsApiService) {}

  ngOnInit() {
    this.warcraftLogsApiService.report.subscribe(report => this.report = report);
  }

  private getEventSource(event: CombatEvent) {
    if (event.sourceIsFriendly) {
      return this.report.friendlies.filter(x => x.id == event.sourceID)[0];
    } else {
      return this.report.enemies.filter(x => x.id == event.sourceID)[0];
    }
  }

}
