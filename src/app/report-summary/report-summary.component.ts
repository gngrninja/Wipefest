import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { WipefestService, Page } from "app/wipefest.service";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { Report, Fight } from "app/warcraft-logs/report";
import { Difficulty } from "app/helpers/difficulty-helper";
import { Timestamp } from "app/helpers/timestamp-helper";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: 'app-report-summary',
    templateUrl: './report-summary.component.html',
    styleUrls: ['./report-summary.component.scss']
})
export class ReportSummaryComponent implements OnInit {

    Difficulty = Difficulty;
    Timestamp = Timestamp;
    Math = Math;

    loading = true;
    report: Report;
    error: any;
    
    get encountersByDifficulty(): Fight[][][] {
        return [this.mythicEncounters, this.heroicEncounters, this.normalEncounters];
    }
    
    mythicEncounters: Fight[][];
    heroicEncounters: Fight[][];
    normalEncounters: Fight[][];

    get warcraftLogsLink(): string {
        return `https://www.warcraftlogs.com/reports/${this.report.id}`;
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private wipefestService: WipefestService,
        private warcraftLogsService: WarcraftLogsService,
        private domSanitizer: DomSanitizer) { }

    ngOnInit() {
        this.wipefestService.selectPage(Page.ReportSummary);
        this.route.params.subscribe((params) => this.handleRoute(params));
    }

    private handleRoute(params: Params) {
        let reportId = params["reportId"];

        this.loading = true;
        this.warcraftLogsService.getReport(reportId)
            .subscribe(report => {
                this.error = null;
                this.selectReport(report);
                this.loading = false;
            }, error => {
                this.error = error;
                this.loading = false;
                this.report = null;
            });
    }

    private selectReport(report: Report) {
        this.report = report;
        if (this.report) {
            this.report.fights = this.report.fights
                .filter(x => x.size >= 10 && [3, 4, 5].indexOf(x.difficulty) != -1)
                .sort(function (a, b) { return a.id - b.id; });
            this.wipefestService.selectReport(this.report);
            this.wipefestService.selectFight(this.report.fights[0]);

            this.populateEncounters();
        }
    }

    private populateEncounters() {
        this.mythicEncounters = [];
        this.heroicEncounters = [];
        this.normalEncounters = [];

        this.report.fights.forEach(fight => {
            var isABoss = fight.boss != 0;

            if (isABoss) {
                if (fight.difficulty == 5) {
                    var alreadyBeenMapped = this.mythicEncounters.filter(x => x.some(y => y.boss == fight.boss)).length > 0;
                    if (!alreadyBeenMapped) {
                        this.mythicEncounters.push(this.report.fights.filter(x => x.boss == fight.boss && x.difficulty == 5));
                    }
                }
                if (fight.difficulty == 4) {
                    var alreadyBeenMapped = this.heroicEncounters.filter(x => x.some(y => y.boss == fight.boss)).length > 0;
                    if (!alreadyBeenMapped) {
                        this.heroicEncounters.push(this.report.fights.filter(x => x.boss == fight.boss && x.difficulty == 4));
                    }
                }
                if (fight.difficulty == 3) {
                    var alreadyBeenMapped = this.normalEncounters.filter(x => x.some(y => y.boss == fight.boss)).length > 0;
                    if (!alreadyBeenMapped) {
                        this.normalEncounters.push(this.report.fights.filter(x => x.boss == fight.boss && x.difficulty == 3));
                    }
                }

            }
        });
    }

    encounterImage(encounter: Fight) {
        return this.domSanitizer.bypassSecurityTrustStyle(`url('http://warcraftlogs.com/img/bosses/${encounter.boss}-execution.png')`);
    }
}
