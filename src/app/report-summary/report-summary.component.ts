import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { WipefestService } from "app/wipefest.service";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { Report, Fight } from "app/warcraft-logs/report";
import { ErrorHandler } from "app/errorHandler";

@Component({
    selector: 'app-report-summary',
    templateUrl: './report-summary.component.html',
    styleUrls: ['./report-summary.component.css']
})
export class ReportSummaryComponent implements OnInit {

    report: Report;
    private encounters: Fight[][];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private wipefestService: WipefestService,
        private warcraftLogsService: WarcraftLogsService) { }

    ngOnInit() {
        this.route.params.subscribe((params) => this.handleRoute(params));
    }

    private handleRoute(params: Params) {
        let reportId = params["reportId"];

        this.warcraftLogsService.getReport(reportId)
            .subscribe(report => {
                this.selectReport(report);
            }, error => ErrorHandler.GoToErrorPage(error, this.wipefestService, this.router));
    }

    private selectReport(report: Report) {
        this.report = report;
        if (this.report) {
            this.report.fights = this.report.fights
                .filter(x => x.size >= 10 && [3, 4, 5].indexOf(x.difficulty) != -1)
                .sort(function (a, b) { return b.id - a.id; });
            this.wipefestService.selectReport(this.report);
            this.wipefestService.selectFight(this.report.fights[0]);

            this.populateEncounters();
        }
    }

    private populateEncounters() {
        this.encounters = [];
        this.report.fights.forEach(fight => {
            var alreadyBeenMapped = this.encounters.filter(x => x.filter(y => y.boss == fight.boss).length > 0).length > 0;
            var isABoss = fight.boss != 0;
            if (!alreadyBeenMapped && isABoss) {
                this.encounters.push(this.report.fights.filter(x => x.boss == fight.boss));
            }
        });
    }
}
