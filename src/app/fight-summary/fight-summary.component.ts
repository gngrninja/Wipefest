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

@Component({
    selector: 'fight-summary',
    templateUrl: './fight-summary.component.html',
    styleUrls: ['./fight-summary.component.scss']
})
export class FightSummaryComponent implements OnInit {

    report: Report;
    fight: Fight;
    get fightIndex(): number {
        return this.report.fights.indexOf(this.fight);
    }
    get warcraftLogsLink(): string {
        return `https://www.warcraftlogs.com/reports/${this.report.id}#fight=${this.fight.id}`;
    }

    configs: EventConfig[] = [];
    events: FightEvent[] = [];
    combatantInfo: CombatEvent[] = [];

    error: any;

    private reportSubscription: Subscription;
    private combatEventSubscription: Subscription;
    private deathsSubscription: Subscription;

    Difficulty = Difficulty;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private wipefestService: WipefestService,
        private eventConfigService: EventConfigService,
        private queryService: QueryService,
        private eventService: FightEventService,
        private warcraftLogsService: WarcraftLogsService,
        private logger: LoggerService) { }

    ngOnInit() {
        this.wipefestService.selectPage(Page.FightSummary);
        this.route.params.subscribe((params) => this.handleRoute(params));
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
        this.combatantInfo = [];
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

        this.loadData();
    }

    private loadData() {
        this.events = [];
        if (this.report && this.fight) {
            let combatEvents = [];
            let loadingCombatEvents = true;
            this.combatEventSubscription = this.loadCombatEvents().subscribe(x => {
                combatEvents = x;
                loadingCombatEvents = false;

                if (!loadingDeaths) this.populateEvents(combatEvents, deaths);
            });

            let deaths = [];
            let loadingDeaths = true;
            this.deathsSubscription = this.loadDeaths().subscribe(x => {
                deaths = x;
                loadingDeaths = false;

                if (!loadingCombatEvents) this.populateEvents(combatEvents, deaths);
            });
        }
    }

    private populateEvents(combatEvents: CombatEvent[], deaths: Death[]) {
        this.combatantInfo = combatEvents.filter(x => x.type == "combatantinfo");

        let events: FightEvent[] = [].concat.apply([], this.configs.map(config => {
            let matchingCombatEvents = this.eventConfigService.filterToMatchingCombatEvents(config, combatEvents, this.report);

            return this.eventService.getEvents(this.report, this.fight, config, matchingCombatEvents, deaths);
        }));

        if (!events.some(x => x.isInstanceOf(PhaseChangeEvent))) {
            this.events.unshift(new TitleEvent(0, "Pull"));
        }
        this.events.push(new EndOfFightEvent(this.fight.end_time - this.fight.start_time, this.fight.kill));
        this.events.push(...events);
        this.events = this.sortEvents(this.events);
    }

    private loadCombatEvents(): Observable<CombatEvent[]> {
        return this.eventConfigService
            .getIncludes(this.fight.boss)
            .flatMap(includes => this.eventConfigService.getEventConfigs(["general/raid"].concat(includes)))
            .flatMap(configs => {
                this.configs = configs;

                return this.warcraftLogsService.getCombatEvents(this.report.id, this.fight.start_time, this.fight.end_time, this.queryService.getQuery(configs));
            }).catch((error, caught) => {
                this.error = error;
                this.logger.logError(error);
                return caught;
            });
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

    private getFriendliesForFight(fightId: number) {
        return this.report.friendlies
            .filter(x => x.fights.map(x => x.id).indexOf(fightId) != -1 && x.type != "Pet")
            .sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (b.name.toLowerCase() < a.name.toLowerCase()) return 1;
                return 0;
            });
    }
}
