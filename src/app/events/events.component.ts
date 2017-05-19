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

  private friendlyEvents(): CombatEvent[] {
    return this.events.filter(x => x.sourceIsFriendly);
  }

  private unfriendlyEvents(): CombatEvent[] {
    return this.events.filter(x => !x.sourceIsFriendly);
  }
}
