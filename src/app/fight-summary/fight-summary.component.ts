import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Report, Fight } from "app/warcraft-logs/report";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { CombatEvent } from "app/warcraft-logs/combat-event";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { WipefestService, Page } from "app/wipefest.service";
import { FightEvent } from "app/fight-events/fight-event";
import { AbilityEvent, Ability } from "app/fight-events/ability-event";
import { DeathEvent } from "app/fight-events/death-event";
import { PhaseChangeEvent } from "app/fight-events/phase-change-event";
import { SpawnEvent } from "app/fight-events/spawn-event";
import { HeroismEvent } from "app/fight-events/heroism-event";
import { DebuffEvent } from "app/fight-events/debuff-event";
import { QueryService } from 'app/warcraft-logs/query.service';
import { EventConfig } from "app/event-config/event-config";
import { EventConfigService } from "app/event-config/event-config.service";
import { EventService } from "app/events/event.service";
import { Observable } from "rxjs/Rx";
import { EndOfFightEvent } from "app/fight-events/end-of-fight-event";
import { Difficulty } from "../helpers/difficulty-helper";
import { LoggerService } from "app/shared/logger.service";
import { TitleEvent } from "app/fight-events/title-event";

@Component({
    selector: 'fight-summary',
    templateUrl: './fight-summary.component.html',
    styleUrls: ['./fight-summary.component.scss']
})
export class FightSummaryComponent implements OnInit {

    report: Report;
    fight: Fight;
    get warcraftLogsLink(): string {
        return `https://www.warcraftlogs.com/reports/${this.report.id}#fight=${this.fight.id}`;
    }

    configs: EventConfig[] = [];
    events: FightEvent[] = [];
    combatantInfo: CombatEvent[] = [];

    error: any;

    Difficulty = Difficulty;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private wipefestService: WipefestService,
        private eventConfigService: EventConfigService,
        private queryService: QueryService,
        private eventService: EventService,
        private warcraftLogsService: WarcraftLogsService,
        private logger: LoggerService) { }

    ngOnInit() {
        this.wipefestService.selectPage(Page.FightSummary);
        this.route.params.subscribe((params) => this.handleRoute(params));
    }

    private handleRoute(params: Params) {
        let reportId = params["reportId"];
        let fightId = params["fightId"];

        this.warcraftLogsService.getReport(reportId)
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
                this.selectFight(this.report.fights[0]);
            }
        } else {
            this.selectFight(this.report.fights[0]);
        }
    }

    private selectFight(fight: Fight) {
        this.fight = fight;
        this.wipefestService.selectFight(this.fight);

        this.populateEvents();
    }

    private populateEvents() {
        this.events = [];
        if (this.report && this.fight) {
            let batch: Observable<FightEvent[]>[] = [
                this.populateCombatEvents(),
                this.populateDeathEvents()
            ];

            Observable.forkJoin(batch)
                .map(x => [].concat.apply([], x))
                .subscribe(events => {
                    if (!events.some(x => x.isInstanceOf(PhaseChangeEvent))) {
                        this.events.unshift(new TitleEvent(0, "Pull"));
                    }
                    this.events.push(new EndOfFightEvent(this.fight.end_time - this.fight.start_time, this.fight.kill));
                    this.events.push(...events);
                    this.events = this.sortEvents(this.events);
                });
        }
    }

    private populateCombatEvents(): Observable<FightEvent[]> {
        return this.eventConfigService
            .getIncludes(this.fight.boss)
            .flatMap(includes => this.eventConfigService.getEventConfigs(["general/raid"].concat(includes)))
            .flatMap(configs => {
                this.configs = configs;

                return this.warcraftLogsService.getCombatEvents(this.report.id, this.fight.start_time, this.fight.end_time, this.queryService.getQuery(configs))
                    .map(combatEvents => {
                        this.combatantInfo = combatEvents.filter(x => x.type == "combatantinfo");

                        return [].concat.apply([], configs.map(config => {
                            let matchingCombatEvents = this.eventConfigService.filterToMatchingCombatEvents(config, combatEvents, this.report);
                            
                            return this.eventService.getEvents(this.report, this.fight, config, matchingCombatEvents);
                        }));
                    });
            }).catch(error => {
                this.error = error;
                return Observable.empty();
            });
    }

    private populateDeathEvents(): Observable<FightEvent[]> {
        return this.warcraftLogsService
            .getDeaths(this.report.id, this.fight.start_time, this.fight.end_time)
            .map(deaths =>
            deaths.map(death =>
                new DeathEvent(
                    null,
                    death.timestamp - this.fight.start_time,
                    true,
                    death.name,
                    death.events && death.events[0] && death.events[0].ability ? new Ability(death.events[0].ability) : null,
                    death.events && death.events[0] && this.eventService.getCombatEventSource(death.events[0], this.report) ? this.eventService.getCombatEventSource(death.events[0], this.report).name : null)))
            .catch((error, caught) => {
                this.error = error;
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
