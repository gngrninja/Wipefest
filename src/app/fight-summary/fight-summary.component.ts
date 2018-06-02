import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalStorage } from 'app/shared/local-storage';
import { LoggerService } from 'app/shared/logger.service';
import { SelectedFocus, StateService } from 'app/shared/state.service';
import { Page, WipefestService } from 'app/wipefest.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { Difficulty } from '../helpers/difficulty-helper';
import { WipefestAPI } from '@wipefest/api-sdk';
import {
  Ability,
  ReportDto,
  FightInfo,
  MarkupFormat,
  RaidDto,
  EventDto,
  Player,
  EventConfig,
  Insight
} from '@wipefest/api-sdk/dist/lib/models';
import { SpecializationsService } from '@wipefest/core';

@Component({
  selector: 'fight-summary',
  templateUrl: './fight-summary.component.html',
  styleUrls: ['./fight-summary.component.scss']
})
export class FightSummaryComponent implements OnInit {
  report: ReportDto;
  fights: FightInfo[];
  fight: FightInfo;
  get fightIndex(): number {
    return this.fights.indexOf(this.fight);
  }
  get warcraftLogsLink(): string {
    return `https://www.warcraftlogs.com/reports/${this.report.id}#fight=${
      this.fight.id
    }`;
  }
  get wowAnalyzerLink(): string {
    return `https://www.wowanalyzer.com/report/${this.report.id}/${
      this.fight.id
    }`;
  }

  focuses: SelectedFocus[] = [];
  configs: EventConfig[] = [];
  events: EventDto[] = [];
  abilities: Ability[] = [];
  focusedEventIndexes: boolean[] = [];
  insights: Insight[] = [];

  get focusedEvents(): EventDto[] {
    return this.events.filter((x, i) => this.focusedEventIndexes[i]);
  }
  eventsBeforeDeathThreshold: EventDto[] = [];
  get focusedEventsBeforeDeathThreshold(): EventDto[] {
    return this.eventsBeforeDeathThreshold.filter(
      (x, i) => this.focusedEventIndexes[i]
    );
  }
  raid: RaidDto;

  enableDeathThreshold: boolean = false;
  deathThreshold: number = 2;
  get maxDeathThreshold(): number {
    return Math.min(5, this.events.filter(x => x.type === 'death').length + 1);
  }

  error: any;

  Difficulty: any = Difficulty;

  private initialLoad: boolean = true;
  private previousFocuses: SelectedFocus[] = [];

  private reportPromise: Promise<void>;
  private loadDataSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wipefestService: WipefestService,
    private wipefestApi: WipefestAPI,
    private specializationsService: SpecializationsService,
    private localStorage: LocalStorage,
    private stateService: StateService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.wipefestService.selectPage(Page.FightSummary);

    this.route.params.subscribe(params => {
      this.previousFocuses = [];
      this.initialLoad = true;
      this.handleRoute(params);
    });

    this.stateService.changes.subscribe(() => {
      this.handleState();
    });
  }

  getEventsBeforeDeathThreshold(
    events: EventDto[],
    deathThreshold: number
  ): EventDto[] {
    let eventsBeforeDeathThreshold = events;
    if (deathThreshold > 0 && this.enableDeathThreshold) {
      const deathEvents = events.filter(x => x.type === 'death');
      if (deathEvents.length >= deathThreshold) {
        const deathThresholdTimestamp =
          deathEvents[deathThreshold - 1].timestamp;
        eventsBeforeDeathThreshold = events.filter(
          x => x.timestamp <= deathThresholdTimestamp
        );
        eventsBeforeDeathThreshold.push(events[events.length - 1]);
      }
    }
    return eventsBeforeDeathThreshold;
  }

  private handleState(): void {
    this.focuses =
      this.stateService.focuses === undefined ? [] : this.stateService.focuses;
    this.enableDeathThreshold =
      this.stateService.ignore === undefined ? false : this.stateService.ignore;
    this.deathThreshold =
      this.stateService.deathThreshold === undefined
        ? 2
        : this.stateService.deathThreshold;

    if (
      this.previousFocuses.map(x => x.id).join(',') !==
      this.focuses.map(x => x.id).join(',')
    ) {
      this.loadDataSubscription = new Observable(observer => {
        if (this.initialLoad) {
          this.initialLoad = false;
          this.loadFocuses();
        } else {
          setTimeout(() => {
            observer.next();
          }, 1000);
        }
      }).subscribe(() => {
        this.loadFocuses();
      });
    }
  }

  private loadFocuses(): void {
    this.previousFocuses = this.focuses;

    if (this.loadDataSubscription) {
      this.loadDataSubscription.unsubscribe();
    }

    this.loadData();
  }

  private handleRoute(params: Params): void {
    const reportId = params.reportId;
    const fightId = params.fightId;

    this.fight = null;
    this.events = [];
    this.insights = [];
    this.configs = [];

    if (this.report && this.report.id === reportId) {
      this.tryToSelectFightById(fightId);
      return;
    }

    this.report = null;

    this.reportPromise = this.wipefestApi.getReport(reportId).then(
      report => {
        this.error = null;
        this.selectReport(report);
        this.tryToSelectFightById(fightId);
      },
      error => {
        this.error = error;
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
      this.wipefestService.selectReport(this.report);
    }
  }

  // tslint:disable-next-line:typedef - sometimes is "last"
  private tryToSelectFightById(fightId): void {
    if (fightId) {
      if (fightId === 'last') {
        this.selectFight(this.fights[this.fights.length - 1]);
        return;
      }

      const matchingFights = this.fights.filter(x => x.id === +fightId);

      if (matchingFights.length > 0) {
        this.selectFight(matchingFights[0]);
      } else {
        this.error = 'Sorry, this fight is not currently supported.';
      }
    } else {
      this.selectFight(this.fights[0]);
    }
  }

  private selectFight(fight: FightInfo): void {
    this.fight = fight;
    this.wipefestService.selectFight(this.fight);

    this.raid = null;
    this.loadData();
  }

  private loadData(): void {
    this.events = [];
    this.eventsBeforeDeathThreshold = [];
    this.insights = [];

    if (this.report && this.fight) {
      const combatEvents = [];
      const loadingCombatEvents = true;
      const deaths = [];
      const loadingDeaths = true;

      this.wipefestApi
        .getFight(this.report.id, this.fight.id, {
          includes: this.getFocusIncludes(),
          markupFormat: MarkupFormat.Markup
        })
        .then(
          fight => {
            this.abilities = fight.abilities;
            this.raid = fight.raid;
            this.wipefestService.selectRaid(fight.raid);

            this.configs = fight.eventConfigs;
            this.wipefestService.selectConfigs(fight.eventConfigs);

            this.insights = fight.insights;
            this.events = fight.events;
            // Remove duplicates (for example, AMS as a personal and as a minor tank cooldown), but priotise non-general/raid-originating events
            this.events = this.events.filter((x, index, array) => {
              const allOccurences = (array as any).filter(
                y =>
                  y.timestamp === x.timestamp &&
                  y.title === x.title &&
                  ((!y.source && !(x as any).source) ||
                    y.source.instance === (x as any).source.instance)
              );
              if (allOccurences.some(x => x.config && x.config.group !== 'R')) {
                const indexOfFirstNonRaidOccurence = (array as any).findIndex(
                  y =>
                    y.config &&
                    y.config.group !== 'R' &&
                    y.timestamp === x.timestamp &&
                    y.title === x.title &&
                    ((!y.source && !(x as any).source) ||
                      y.source.instance === (x as any).source.instance)
                );
                return indexOfFirstNonRaidOccurence === index;
              } else {
                const indexOfFirstOccurence = (array as any).findIndex(
                  y =>
                    y.timestamp === x.timestamp &&
                    y.title === x.title &&
                    ((!y.source && !(x as any).source) ||
                      y.source.instance === (x as any).source.instance)
                );
                return indexOfFirstOccurence === index;
              }
            });

            // Decide which events should be focused
            this.focusedEventIndexes = this.events.map(x => true);
            const focusedPlayerNames = this.raid.players
              .filter(
                player =>
                  this.focuses
                    .map(f => parseInt(f.id))
                    .indexOf(player.actorId) !== -1
              )
              .map(player => player.name);
            this.events.forEach((event, i) => {
              if (event.configId) {
                const weAreFocusing = this.focuses.length > 0;
                const eventConfigIsFromABossInclude = !(
                  ['R', 'F', 'T', 'H', 'RA', 'M'].some(
                    x => x === event.configGroup
                  ) ||
                  this.specializationsService
                    .getSpecializations()
                    .map(spec => [spec.group, spec.generalGroup])
                    .reduce((x, y) => x.concat(y))
                    .some(group => group === event.configGroup)
                );

                const eventConfigIsPlayerSpecific = this.getConfig(
                  event
                ).tags.some(tag =>
                  ['player', 'interrupt', 'tank'].includes(tag)
                );
                const eventIsHeroism = event.type === 'heroism';
                if (
                  !eventIsHeroism &&
                  weAreFocusing &&
                  (eventConfigIsPlayerSpecific ||
                    !eventConfigIsFromABossInclude)
                ) {
                  this.focusedEventIndexes[i] = focusedPlayerNames.some(
                    name => event.title.indexOf(name) !== -1
                  );
                }
              }
            });
            this.eventsBeforeDeathThreshold = this.getEventsBeforeDeathThreshold(
              this.events,
              this.deathThreshold
            );
          },
          error => {
            this.error = error;
            this.events = [];
            this.insights = [];
          }
        );
    }
  }

  private getConfig(event: EventDto): EventConfig {
    return this.configs.find(
      x => x.id === event.configId && x.group === event.configGroup
    );
  }

  private getFocusIncludes(): string[] {
    if (this.raid == null) {
      return [];
    }

    return []
      .concat(this.focuses.length > 0 ? ['general/focus'] : [])
      .concat(
        this.focuses
          .map(x => this.getPlayer(x.id).specialization.role.toLowerCase())
          .map(x => 'general/' + x)
      )
      .concat(
        this.focuses.map(
          x => this.getPlayer(x.id).specialization.generalInclude
        )
      )
      .concat(this.focuses.map(focus => focus.includes[0]))
      .filter((x, index, array) => array.indexOf(x) === index);
  }

  private getPlayer(id: string): Player {
    const friendly = this.report.friendlies.find(f => f.id.toString() === id);
    return this.raid.players.find(p => p.name === friendly.name);
  }

  private onDeathThresholdChange(event: any): void {
    this.stateService.deathThreshold = this.deathThreshold;
  }

  private toggleDeathThreshold(): void {
    this.enableDeathThreshold = !this.enableDeathThreshold;
    this.eventsBeforeDeathThreshold = this.getEventsBeforeDeathThreshold(
      this.events,
      this.deathThreshold
    );
    this.stateService.ignore = this.enableDeathThreshold;
  }
}
