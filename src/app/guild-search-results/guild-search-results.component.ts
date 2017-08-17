import { Component, OnInit } from '@angular/core';
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { GuildReport } from "app/warcraft-logs/guild-report";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { WipefestService, Page } from "app/wipefest.service";
import { ErrorHandler } from "app/errorHandler";
import { Timestamp } from "app/helpers/timestamp-helper";
import { LocalStorage } from "app/shared/local-storage";

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
        private warcraftLogsService: WarcraftLogsService,
        private localStorage: LocalStorage) { }

    ngOnInit() {
        this.wipefestService.selectPage(Page.GuildSearchResults);
        this.route.params.subscribe((params) => this.handleRoute(params));
    }

    private handleRoute(params: Params) {
        this.guild = params["guild"] || this.localStorage.get("guild");
        this.realm = params["realm"] || this.localStorage.get("guildRealm");
        this.region = params["region"] || this.localStorage.get("guildRegion");
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
