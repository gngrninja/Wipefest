import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Difficulty } from 'app/helpers/difficulty-helper';
import { Timestamp } from 'app/helpers/timestamp-helper';
import { Page, WipefestService } from 'app/wipefest.service';
import { WipefestAPI } from '@wipefest/api-sdk';
import { ReportDto, FightInfo } from '@wipefest/api-sdk/dist/lib/models';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss']
})
export class ReportSummaryComponent implements OnInit {
  Difficulty = Difficulty;
  Timestamp = Timestamp;
  Math = Math;

  loading = false;
  reportId = '';
  report: ReportDto;
  fights: FightInfo[];
  error: any;
  lastFightId = 0;

  get encountersByDifficulty(): FightInfo[][][] {
    return [
      this.mythicEncounters,
      this.heroicEncounters,
      this.normalEncounters
    ];
  }

  mythicEncounters: FightInfo[][];
  heroicEncounters: FightInfo[][];
  normalEncounters: FightInfo[][];

  get warcraftLogsLink(): string {
    return `https://www.warcraftlogs.com/reports/${this.report.id}`;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wipefestService: WipefestService,
    private wipefestApi: WipefestAPI,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.wipefestService.selectPage(Page.ReportSummary);
    this.route.params.subscribe(params => this.handleRoute(params));
  }

  encounterImage(encounter: FightInfo): SafeStyle {
    return this.domSanitizer.bypassSecurityTrustStyle(
      `url('http://warcraftlogs.com/img/bosses/${
        encounter.boss
      }-execution.png')`
    );
  }

  private handleRoute(params: Params): void {
    const reportId = params.reportId;

    if (!reportId) {
      return;
    }

    this.reportId = reportId;
    this.loading = true;
    this.wipefestApi.getReport(this.reportId).then(
      report => {
        this.error = null;
        this.selectReport(report);
        this.loading = false;
      },
      error => {
        this.error = error;
        this.loading = false;
        this.report = null;
      }
    );
  }

  private selectReport(report: ReportDto): void {
    this.report = report;
    if (this.report) {
      this.fights = this.report.fights
        .filter(x => x.size >= 10 && [3, 4, 5].indexOf(x.difficulty) !== -1)
        .sort(function(a: FightInfo, b: FightInfo): number {
          return a.id - b.id;
        });

      this.populateEncounters();
      this.wipefestService.selectReport(this.report);

      if (this.report.fights.length === 0) {
        this.error = 'Sorry, this report contains no supported fights.';
        return;
      }

      this.lastFightId = this.report.fights[this.report.fights.length - 1].id;

      this.wipefestService.selectFight(this.fights[0]);
    }
  }

  private populateEncounters(): void {
    this.mythicEncounters = [];
    this.heroicEncounters = [];
    this.normalEncounters = [];

    this.report.fights.forEach(fight => {
      const isABoss = fight.boss !== 0;

      if (isABoss) {
        if (fight.difficulty === 5) {
          const alreadyBeenMapped =
            this.mythicEncounters.filter(x =>
              x.some(y => y.boss === fight.boss)
            ).length > 0;
          if (!alreadyBeenMapped) {
            this.mythicEncounters.push(
              this.fights.filter(
                x => x.boss === fight.boss && x.difficulty === 5
              )
            );
          }
        }
        if (fight.difficulty === 4) {
          const alreadyBeenMapped =
            this.heroicEncounters.filter(x =>
              x.some(y => y.boss === fight.boss)
            ).length > 0;
          if (!alreadyBeenMapped) {
            this.heroicEncounters.push(
              this.report.fights.filter(
                x => x.boss === fight.boss && x.difficulty === 4
              )
            );
          }
        }
        if (fight.difficulty === 3) {
          const alreadyBeenMapped =
            this.normalEncounters.filter(x =>
              x.some(y => y.boss === fight.boss)
            ).length > 0;
          if (!alreadyBeenMapped) {
            this.normalEncounters.push(
              this.report.fights.filter(
                x => x.boss === fight.boss && x.difficulty === 3
              )
            );
          }
        }
      }
    });
  }
}
