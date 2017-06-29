import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Report, Fight } from "app/warcraft-logs/report";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { CombatEvent } from "app/warcraft-logs/combat-event";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { WipefestService } from "app/wipefest.service";
import { FightEvent } from "app/fight-events/fight-event";
import { AbilityEvent, Ability } from "app/fight-events/ability-event";
import { DeathEvent } from "app/fight-events/death-event";
import { PhaseChangeEvent } from "app/fight-events/phase-change-event";
import { SpawnEvent } from "app/fight-events/spawn-event";
import { HeroismEvent } from "app/fight-events/heroism-event";
import { DebuffEvent } from "app/fight-events/debuff-event";
import { ErrorHandler } from "app/errorHandler";
import { QueryService } from 'app/warcraft-logs/query.service';
import { EventConfig } from "app/event-config/event-config";
import { EventConfigService } from "app/event-config/event-config.service";
import { EventService } from "app/events/event.service";
import { Observable } from "rxjs/Rx";

@Component({
    selector: 'fight-summary',
    templateUrl: './fight-summary.component.html',
    styleUrls: ['./fight-summary.component.css']
})
export class FightSummaryComponent implements OnInit {

    report: Report;
    fight: Fight;

    private configs: EventConfig[] = [];
    private events: FightEvent[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private wipefestService: WipefestService,
        private eventConfigService: EventConfigService,
        private queryService: QueryService,
        private eventService: EventService,
        private warcraftLogsService: WarcraftLogsService) { }

    ngOnInit() {
        this.route.params.subscribe((params) => this.handleRoute(params));
    }

    private handleRoute(params: Params) {
        let reportId = params["reportId"];
        let fightId = params["fightId"];

        this.warcraftLogsService.getReport(reportId)
            .subscribe(report => {
                this.selectReport(report);
                this.tryToSelectFightById(fightId);
            }, error => ErrorHandler.GoToErrorPage(error, this.wipefestService, this.router));
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
                .subscribe(events => this.events = this.sortEvents(events));
        }
    }

    private populateCombatEvents(): Observable<FightEvent[]> {
        return this.eventConfigService
            .getIncludes(this.fight.boss)
            .flatMap(includes => this.eventConfigService.getEventConfigs(["general/raid"].concat(includes)))
            .flatMap(configs => {
                this.configs = configs;

                return this.warcraftLogsService.getCombatEvents(this.report.id, this.fight.start_time, this.fight.end_time, this.queryService.getQuery(configs))
                    .map(combatEvents =>
                        [].concat.apply([], configs.map(config => {
                            let matchingCombatEvents = this.eventConfigService.filterToMatchingCombatEvents(config, combatEvents, this.report);

                            try {
                                return this.eventService.getEvents(this.report, this.fight, config, matchingCombatEvents);
                            } catch (error) {
                                ErrorHandler.GoToErrorPage(error, this.wipefestService, this.router);
                            }
                        })));
            });
    }

    private populateDeathEvents(): Observable<FightEvent[]> {
        return this.warcraftLogsService
            .getDeaths(this.report.id, this.fight.start_time, this.fight.end_time)
            .map(deaths =>
                deaths.map(death =>
                    new DeathEvent(
                        death.timestamp - this.fight.start_time,
                        true,
                        death.name,
                        death.events && death.events[0] && death.events[0].ability ? new Ability(death.events[0].ability) : null,
                        death.events && death.events[0] && this.eventService.getCombatEventSource(death.events[0], this.report) ? this.eventService.getCombatEventSource(death.events[0], this.report).name : null)));
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

}
