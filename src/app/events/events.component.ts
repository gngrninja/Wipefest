import { Component, Input, OnInit } from '@angular/core';
import { CombatEvent } from "../warcraft-logs-api/combat-event"
import { WarcraftLogsApiService } from "../warcraft-logs-api/warcraft-logs-api.service";
import { Report, Fight } from "../warcraft-logs-api/report";

@Component({
    selector: 'events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

    @Input()
    events: CombatEvent[];

    @Input()
    fight: Fight;

    report: Report;

    constructor(private warcraftLogsApiService: WarcraftLogsApiService) { }

    ngOnInit() {
        this.warcraftLogsApiService.report.subscribe(report => this.report = report);
    }

    private source(event: CombatEvent) {
        if (event.sourceIsFriendly) {
            return this.report.friendlies.filter(x => x.id === event.sourceID)[0];
        } else {
            return this.report.enemies.filter(x => x.id === event.sourceID)[0];
        }
    }

    private iconUrl(event: CombatEvent) {
        return `https://www.warcraftlogs.com/img/icons/abilities/${event.ability.abilityIcon}`;
    }

    private initials(input: string): string {
        return input.split(" ").map(w => w[0]).join("");
    }
}
