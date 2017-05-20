import { Component, OnInit } from '@angular/core';
import { WarcraftLogsApiService } from "./warcraft-logs-api/warcraft-logs-api.service";
import { Ranking } from "./warcraft-logs-api/ranking";
import { CombatEvent } from "./warcraft-logs-api/combat-event";
import { Report, Fight } from "./warcraft-logs-api/report";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    private selectedReport: Report;
    
    private selectedFight: Fight;

    private events: CombatEvent[];

    private searchTerm: string;
    private selectedReportId: string;

    constructor(private warcraftLogsApiService: WarcraftLogsApiService) { }

    ngOnInit() {
        this.warcraftLogsApiService.report.subscribe(report => this.selectedReport = report);
        this.warcraftLogsApiService.events.subscribe(events => this.events = events);

        this.searchTerm = "KAVknfHTWv1PrzXR";
        this.search();
    }

    private search() {
        this.selectedReportId = this.searchTerm;
        this.events = null;
        this.selectedReport = null;

        this.warcraftLogsApiService.getReport(this.selectedReportId)
            .then(() =>
                this.selectedReport.fights = this.selectedReport.fights.filter(x => x.boss == 1866).reverse())
            .then(() =>
                this.selectFight(this.selectedReport.fights[0])
            );
    }

    private selectFight(fight: Fight) {
        this.selectedFight = fight;
        this.events = null;

        this.warcraftLogsApiService.getEvents(this.selectedReportId, fight.start_time, fight.end_time, this.getEventFilter());
    }

    private raidCooldownIds = [31821, 62618, 98008, 97462, 64843, 108280, 740, 115310, 15286, 196718, 206222, 30449];
    private guldanAbilityIds = [206222, 212258, 209270, 206219, 206221, 206220, 227427, 221783, 211152, 206939, 206744, 167819, 211439, 221408, 208801, 226975, 221486];

    private getEventFilter(): string {
        const filter = `type = 'cast' and ability.id in (${this.raidCooldownIds.join(", ")}, ${this.guldanAbilityIds.join(", ")})`;

        return filter;
    }

}
