import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Timestamp } from 'app/helpers/timestamp-helper';
import { LocalStorage } from 'app/shared/local-storage';
import { LoggerService } from 'app/shared/logger.service';
import { Page, WipefestService } from 'app/wipefest.service';
import { WipefestAPI } from '@wipefest/api-sdk';
import { GuildReport } from '@wipefest/api-sdk/dist/lib/models';

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
  reports: GuildReport[] = [];

  Timestamp = Timestamp;

  error: any;

  showSearch = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wipefestService: WipefestService,
    private wipefestApi: WipefestAPI,
    private localStorage: LocalStorage,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    this.wipefestService.selectPage(Page.GuildSearchResults);
    this.route.params.subscribe(params => this.handleRoute(params));
  }

  private handleRoute(params: Params) {
    this.loading = true;

    this.guild = params.guild || this.localStorage.get('guild');
    this.realm = params.realm || this.localStorage.get('guildRealm');
    this.region = params.region || this.localStorage.get('guildRegion');
    this.reports = [];

    if (!this.guild || !this.realm || !this.region) {
      this.loading = false;
      return;
    }

    this.wipefestApi
      .getGuildReports(this.region, this.realm, this.guild)
      .then(reports => {
        this.loading = false;
        this.error = null;

        reports = reports
          .filter(x => x.zone === 13 || x.zone === 17)
          .sort((a, b) => b.start - a.start);
        this.reports = reports;
      })
      .catch(error => {
        this.error = error;
        this.loading = false;
        this.reports = [];
      });
  }
}
