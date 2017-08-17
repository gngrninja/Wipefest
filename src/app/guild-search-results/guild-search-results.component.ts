import { Component, OnInit } from '@angular/core';
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { GuildReport } from "app/warcraft-logs/guild-report";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { WipefestService, Page } from "app/wipefest.service";
import { ErrorHandler } from "app/errorHandler";
import { Timestamp } from "app/helpers/timestamp-helper";

@Component({
    selector: 'app-guild-search-results',
    templateUrl: './guild-search-results.component.html',
    styleUrls: ['./guild-search-results.component.scss']
})
export class GuildSearchResultsComponent implements OnInit {

    loading = true;
    guild: string;
    realm: string;
    region: string;
    reports: GuildReport[] = null;

    Timestamp = Timestamp;

    showSearch = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private wipefestService: WipefestService,
        private warcraftLogsService: WarcraftLogsService) { }

    ngOnInit() {
        this.wipefestService.selectPage(Page.GuildSearchResults);
        this.route.params.subscribe((params) => this.handleRoute(params));
    }

    private handleRoute(params: Params) {
        this.guild = params["guild"];
        this.realm = params["realm"];
        this.region = params["region"];
        this.reports = null;

        this.loading = true;
        this.warcraftLogsService.getGuildReports(this.guild, this.realm, this.region, 0, new Date().getTime())
            .subscribe(reports => {
                reports = reports.filter(x => x.zone == 13).sort((a, b) => b.start - a.start);
                this.reports = reports;
                this.loading = false;
            },
            error => { this.loading = false; this.reports = []; });
    }

}
