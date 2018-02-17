import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Report, Fight } from "app/warcraft-logs/report";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { CombatEvent } from "app/warcraft-logs/combat-event";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { WipefestService, Page } from "app/wipefest.service";
import { FightEvent } from "app/fight-events/models/fight-event";
import { QueryService } from 'app/warcraft-logs/query.service';
import { EventConfig } from "app/event-config/event-config";
import { EventConfigService } from "app/event-config/event-config.service";
import { FightEventService } from "app/fight-events/services/fight-event.service";
import { Observable } from "rxjs/Rx";
import { EndOfFightEvent } from "app/fight-events/models/end-of-fight-event";
import { Difficulty } from "../helpers/difficulty-helper";
import { LoggerService } from "app/shared/logger.service";
import { TitleEvent } from "app/fight-events/models/title-event";
import { Subscription } from "rxjs/Subscription";
import { Death } from "app/warcraft-logs/death";
import { PhaseChangeEvent } from "app/fight-events/models/phase-change-event";
import { DeathEvent } from "app/fight-events/models/death-event";
import { environment } from "environments/environment";
import { LocalStorage } from "app/shared/local-storage";
import { Raid, RaidFactory, Player } from "app/raid/raid";
import { ClassesService } from "app/warcraft-logs/classes.service";
import { StateService, SelectedFocus } from "app/shared/state.service";

@Component({
    selector: 'fight-summary',
    templateUrl: './fight-summary.component.html',
    styleUrls: ['./fight-summary.component.scss']
})
export class FightSummaryComponent implements OnInit {

    private initialLoad = true;
    report: Report;
    fight: Fight;
    get fightIndex(): number {
        return this.report.fights.indexOf(this.fight);
    }
    get warcraftLogsLink(): string {
        return `https://www.warcraftlogs.com/reports/${this.report.id}#fight=${this.fight.id}`;
    }
    
    focuses: SelectedFocus[] = [];
    private previousFocuses: SelectedFocus[] = [];
    configs: EventConfig[] = [];
    events: FightEvent[] = [];
    get focusedEvents(): FightEvent[] {
        return this.events.filter(x => x.isFocused);
    }
    eventsBeforeDeathThreshold: FightEvent[] = [];
    get focusedEventsBeforeDeathThreshold(): FightEvent[] {
        return this.eventsBeforeDeathThreshold.filter(x => x.isFocused);
    }
    combatantInfos: CombatEvent[] = [];
    raid: Raid;

    enableDeathThreshold = false;
    deathThreshold = 2;

    error: any;

    private reportSubscription: Subscription;
    private combatEventSubscription: Subscription;
    private deathsSubscription: Subscription;
    private loadDataSubscription: Subscription;

    Difficulty = Difficulty;
    eventConfigAccount: string;
    eventConfigBranch: string;
    canChangeEventConfigBranch = window.location.href.indexOf("www.wipefest.net") == -1;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private wipefestService: WipefestService,
        private eventConfigService: EventConfigService,
        private queryService: QueryService,
        private eventService: FightEventService,
        private warcraftLogsService: WarcraftLogsService,
        private classesService: ClassesService,
        private localStorage: LocalStorage,
        private stateService: StateService,
        private logger: LoggerService) { }

    ngOnInit() {
        this.wipefestService.selectPage(Page.FightSummary);

        this.eventConfigAccount = this.localStorage.get("eventConfigAccount") || "JoshYaxley";
        this.eventConfigBranch = this.localStorage.get("eventConfigBranch") || "master";

        this.route.params.subscribe((params) => {
            this.handleRoute(params);
        });

        this.stateService.changes.subscribe(() => {
            this.focuses = this.stateService.focuses == undefined ? [] : this.stateService.focuses;
            this.enableDeathThreshold = this.stateService.ignore == undefined ? false : this.stateService.ignore;
            this.deathThreshold = this.stateService.deathThreshold == undefined ? 2 : this.stateService.deathThreshold;

            if (this.loadDataSubscription) {
                this.loadDataSubscription.unsubscribe();
            }

            if (this.previousFocuses.map(x => x.id).join(",") != this.focuses.map(x => x.id).join(",")) {
                this.loadDataSubscription = new Observable(observer => {
                    if (this.initialLoad) {
                        this.initialLoad = false;
                        this.loadFocuses();
                    } else {
                        setTimeout(() => { observer.next(); }, 1500);
                    }
                }).subscribe(() => {
                    this.loadFocuses();
                });
            }
        });
    }

    private loadFocuses() {
        this.previousFocuses = this.focuses;

        if (this.combatEventSubscription) {
            this.combatEventSubscription.unsubscribe();
        }
        if (this.deathsSubscription) {
            this.deathsSubscription.unsubscribe();
        }

        if (this.loadDataSubscription) {
            this.loadDataSubscription.unsubscribe();
        }

        this.loadData();
    }

    private handleRoute(params: Params) {
        if (this.reportSubscription) {
            this.reportSubscription.unsubscribe();
        }

        if (this.combatEventSubscription) {
            this.combatEventSubscription.unsubscribe();
        }
        if (this.deathsSubscription) {
            this.deathsSubscription.unsubscribe();
        }

        let reportId = params["reportId"];
        let fightId = params["fightId"];

        this.fight = null;
        this.events = [];
        this.combatantInfos = [];
        this.configs = [];

        if (this.report && this.report.id == reportId) {
            this.tryToSelectFightById(fightId);
            return;
        }

        this.report = null;

        this.reportSubscription = this.warcraftLogsService.getReport(reportId)
            .subscribe(report => {
                this.error = null;
                this.selectReport(report);
                this.tryToSelectFightById(fightId);
            }, error => this.error = error);
    }

    private selectReport(report: Report) {
        this.report = report;
        if (this.report) {
            this.report.fights = this.report.fights
                .filter(x => x.size >= 10 && [3, 4, 5].indexOf(x.difficulty) != -1)
                .sort(function (a, b) { return a.id - b.id; });
            this.wipefestService.selectReport(this.report);
        }
    }

    private tryToSelectFightById(fightId) {
        if (fightId) {
            if (fightId == "last") {
                this.selectFight(this.report.fights[this.report.fights.length - 1]);
                return;
            }

            let matchingFights = this.report.fights.filter(x => x.id == +fightId);

            if (matchingFights.length > 0) {
                this.selectFight(matchingFights[0]);
            } else {
                this.error = "Sorry, this fight is not currently supported."
            }
        } else {
            this.selectFight(this.report.fights[0]);
        }
    }

    private selectFight(fight: Fight) {
        this.fight = fight;
        this.wipefestService.selectFight(this.fight);
        
        this.raid = null;
        this.loadData();
    }

    private loadData() {
        this.events = [];
        this.eventsBeforeDeathThreshold = [];

        if (this.report && this.fight) {
            let combatEvents = [];
            let loadingCombatEvents = true;
            this.combatEventSubscription = this.loadCombatEvents().subscribe(x => {
                combatEvents = x;
                loadingCombatEvents = false;

                if (!loadingDeaths) {
                    this.populateEvents(combatEvents, deaths);
                }
            });

            let deaths = [];
            let loadingDeaths = true;
            this.deathsSubscription = this.loadDeaths().subscribe(x => {
                deaths = x;
                loadingDeaths = false;

                if (!loadingCombatEvents) {
                    this.populateEvents(combatEvents, deaths);
                }
            });
        }
    }

    private populateEvents(combatEvents: CombatEvent[], deaths: Death[]) {
        this.combatantInfos = combatEvents.filter(x => x.type == "combatantinfo");
        this.raid = RaidFactory.Get(this.combatantInfos, this.getPlayersForFight(this.fight.id), this.classesService);
        this.wipefestService.selectRaid(this.raid);

        let events: FightEvent[] = [].concat.apply([], this.configs.map(config => {
            let matchingCombatEvents = this.eventConfigService.filterToMatchingCombatEvents(config, combatEvents, this.fight, this.report);

            return this.eventService.getEvents(this.report, this.fight, config, matchingCombatEvents, deaths);
        }));

        this.events = [];
        if (!events.some(x => x.isInstanceOf(PhaseChangeEvent))) {
            this.events.unshift(new TitleEvent(0, "Pull"));
        }
        this.events.push(new EndOfFightEvent(this.fight.end_time - this.fight.start_time, this.fight.kill));
        this.events.push(...events);
        this.events = this.sortEvents(this.events);
        this.events = this.events.filter((x, index, array) => {
            let allOccurences = (<any>array).filter(y =>
                y.timestamp == x.timestamp &&
                y.title == x.title &&
                ((!y.source && !(<any>x).source) || y.source.instance == (<any>x).source.instance));

            if (allOccurences.some(x => x.config && x.config.group != "R")) {
                let indexOfFirstNonRaidOccurence = (<any>array).findIndex(y =>
                    y.config && y.config.group != "R" &&
                    y.timestamp == x.timestamp &&
                    y.title == x.title &&
                    ((!y.source && !(<any>x).source) || y.source.instance == (<any>x).source.instance));
                return indexOfFirstNonRaidOccurence == index;
            } else {
                let indexOfFirstOccurence = (<any>array).findIndex(y =>
                    y.timestamp == x.timestamp &&
                    y.title == x.title &&
                    ((!y.source && !(<any>x).source) || y.source.instance == (<any>x).source.instance));
                return indexOfFirstOccurence == index;
            }
        }); // Remove duplicates (for example, AMS as a personal and as a minor tank cooldown), but priotise non-general/raid-originating events
        this.events.forEach(event => {
            if (event.config) {
                let weAreFocusing = this.focuses.length > 0;
                let eventConfigIsFromABossInclude = !(["R", "F", "T", "H", "RA", "M"].some(x => x == event.config.group) || this.classesService.specializations.map(spec => spec.group).some(group => group == event.config.group));
                let eventConfigIsPlayerSpecific = event.config.tags.some(tag => ["player", "interrupt", "tank"].includes(tag));
                let eventIsHeroism = event.config.eventType == "heroism";
                if (!eventIsHeroism && weAreFocusing && (eventConfigIsPlayerSpecific || !eventConfigIsFromABossInclude)) {
                    let untypedEvent = <any>event;
                    let isSource = false;
                    let isTarget = false;
                    if (untypedEvent.source && untypedEvent.source.id) {
                        isSource = this.focuses.some(focus => untypedEvent.source.id.toString() == focus.id);
                    }
                    if (untypedEvent.target && untypedEvent.target.id) {
                        isTarget = this.focuses.some(focus => untypedEvent.target.id.toString() == focus.id);
                    }
                    event.isFocused = isSource || isTarget;
                }
            }
        });
        this.eventsBeforeDeathThreshold = this.getEventsBeforeDeathThreshold(this.events, this.deathThreshold);
    }

    private loadCombatEvents(): Observable<CombatEvent[]> {
        this.error = null;

        return this.eventConfigService
            .getIncludes(this.fight.boss, this.eventConfigAccount, this.eventConfigBranch)
            .flatMap(bossIncludes => this.eventConfigService.getEventConfigs(this.getGeneralIncludes().concat(this.focuses.map(focus => focus.include).filter((x, index, array) => array.indexOf(x) == index)).concat(bossIncludes), this.eventConfigAccount, this.eventConfigBranch))
            .flatMap(configs => {
                // Check for non-unique ids within a group (as this will break when storing state in URL)
                let duplicates = this.getDuplicates(configs);
                if (duplicates.length > 0) {
                    throw "Error: Cannot have duplicate ids within the same group. " + duplicates.map(x => `${x.id} (${x.file}) is a duplicate id in group ${x.group}`).join(", ") + ".";
                }

                this.configs = configs.filter(config => !config.difficulties || config.difficulties.indexOf(this.fight.difficulty) != -1);

                return this.warcraftLogsService.getCombatEvents(this.report.id, this.fight.start_time, this.fight.end_time, this.queryService.getQuery(configs));
            }).catch((error, caught) => {
                this.error = error;
                this.logger.logError(error);
                return Observable.empty();
            });
    }

    private getGeneralIncludes(): string[] {
        if (this.raid == null)
            return ["general/raid"];

        return ["general/raid"]
            .concat(this.focuses.length > 0 ? ["general/focus"] : [])
            .concat(
            this.focuses
                .map(x => this.getPlayer(x.id).specialization.role.toLowerCase())
                .filter((x, index, array) => array.indexOf(x) == index)
                .map(x => "general/" + x)
        );
    }

    private getPlayer(id: string): Player {
        let friendly = this.report.friendlies.find(f => f.id.toString() == id);
        return this.raid.players.find(p => p.name == friendly.name);
    }

    private getDuplicates(configs: EventConfig[]): EventConfig[] {
        let groupedConfigs: EventConfig[][] = [];
        configs.forEach(config => {
            let index = groupedConfigs.findIndex(x => x.some(y => y.group == config.group && y.id == config.id));
            if (index != -1) {
                groupedConfigs[index].push(config);
            } else {
                groupedConfigs.push([config]);
            }
        });
        let duplicates = groupedConfigs.filter(x => x.length > 1).map(x => x[0]);

        return duplicates;
    }

    private loadDeaths(): Observable<Death[]> {
        return this.warcraftLogsService
            .getDeaths(this.report.id, this.fight.start_time, this.fight.end_time)
            .catch((error, caught) => {
                this.error = error;
                this.logger.logError(error);
                return caught;
            });
    }

    getEventsBeforeDeathThreshold(events: FightEvent[], deathThreshold: number): FightEvent[] {
        let eventsBeforeDeathThreshold = events;
        if (deathThreshold > 0 && this.enableDeathThreshold) {
            let deathEvents = events.filter(x => x.config).filter(x => x.config.name == "Deaths").map(x => <DeathEvent>x);
            if (deathEvents.length >= deathThreshold) {
                let deathThresholdTimestamp = deathEvents[deathThreshold - 1].timestamp;
                eventsBeforeDeathThreshold = events.filter(x => x.timestamp <= deathThresholdTimestamp);
                eventsBeforeDeathThreshold.push(events[events.length - 1]);
            }
        }
        return eventsBeforeDeathThreshold;
    }

    private sortEvents(events: FightEvent[]): FightEvent[] {
        return events.sort((a: any, b: any) => {
            let sort = a.timestamp - b.timestamp;

            if (a["sequence"] && b["sequence"]) {
                sort = sort || a.sequence - b.sequence;
            }

            if (a["instance"] && b["instance"]) {
                sort = sort || a.instance - b.instance;
            }

            return sort;
        });
    }

    private getPlayersForFight(fightId: number) {
        return this.report.friendlies
            .filter(x => x.fights.map(x => x.id).indexOf(fightId) != -1 && this.classesService.specializations.some(s => s.type == x.type))
            .sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (b.name.toLowerCase() < a.name.toLowerCase()) return 1;
                return 0;
            });
    }

    private onDeathThresholdChange(event) {
        this.stateService.deathThreshold = this.deathThreshold;
    }

    private toggleDeathThreshold() {
        this.enableDeathThreshold = !this.enableDeathThreshold;
        this.eventsBeforeDeathThreshold = this.getEventsBeforeDeathThreshold(this.events, this.deathThreshold);
        this.stateService.ignore = this.enableDeathThreshold;
    }

    setEventConfigLocation() {
        this.localStorage.set("eventConfigAccount", this.eventConfigAccount);
        this.localStorage.set("eventConfigBranch", this.eventConfigBranch);
    }
}
