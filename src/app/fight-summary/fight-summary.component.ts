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

@Component({
    selector: 'fight-summary',
    templateUrl: './fight-summary.component.html',
    styleUrls: ['./fight-summary.component.css']
})
export class FightSummaryComponent implements OnInit {

    report: Report;
    fight: Fight;

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
                .sort(function (a, b) { return b.id - a.id; });
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
            this.populateCombatEvents();
            this.populateDeathEvents();
        }
    }

    private populateCombatEvents() {
        this.eventConfigService.getIncludes(this.fight.boss).subscribe(includes => {
            this.eventConfigService.getEventConfigs(["general/raid"].concat(includes)).subscribe(configs => {
                this.warcraftLogsService
                    .getCombatEvents(this.report.id, this.fight.start_time, this.fight.end_time, this.queryService.getQuery(configs))
                    .subscribe(combatEvents => {
                        configs.forEach(config => {
                            let matchingCombatEvents = this.eventConfigService.filterToMatchingCombatEvents(config, combatEvents, this.report);

                            try {
                                this.events = this.events.concat(this.eventService.getEvents(this.report, this.fight, config, matchingCombatEvents));
                            } catch (error) {
                                ErrorHandler.GoToErrorPage(error, this.wipefestService, this.router);
                            }
                        });

                        this.events = this.sortEvents(this.events);
                    },
                    error => ErrorHandler.GoToErrorPage(error, this.wipefestService, this.router)
                    );
            });
        });

    }

    private populateDeathEvents() {
        this.warcraftLogsService
            .getDeaths(
            this.report.id,
            this.fight.start_time,
            this.fight.end_time)
            .subscribe(deaths =>
                this.events = this.sortEvents(this.events.concat(
                    deaths.map(
                        death => new DeathEvent(
                            death.timestamp - this.fight.start_time,
                            true,
                            death.name,
                            death.events && death.events[0] && death.events[0].ability ? new Ability(death.events[0].ability) : null,
                            death.events && death.events[0] && this.eventService.getCombatEventSource(death.events[0], this.report) ? this.eventService.getCombatEventSource(death.events[0], this.report).name : null)))),
            error => ErrorHandler.GoToErrorPage(error, this.wipefestService, this.router));
    }

    private bossAbilityIds =
    [
        204316, 204372, 204448, 204471, // Skorpyron
        211927, 206610, // Chronomatic Anomaly
        207630, 208924, 206820, 208506, 207502, 206559, 206560, 206557, 207513, 206788, // Trilliax
        213564, 213853, 213567, 212492, 212735, 213275, 213852, 212530, 213182, // Spellblade Aluriel
        212997, 213531, 208230, 206365, 213238, // Tichondrius
        206585, 222761, 206517, 206949, 205408, 205984, 214335, 214167, 221875, 207439, 207720, 216909, // Star Auger Etraeus
        205420, 205368, 205344, 205361, 205862,  // Krosus
        218424, 218304, 218807, 218809, 218438, 218148, 218774, // High Botanist Tel'arn
        209165, 209166, 228877, 209168, 210022, 209973, 214278, 208944, 208865, 209598, // Grand Magistrix Elisande
        206222, 212258, 209270, 206219, 206221, 206220, 221783, 211152, 206939, 206744, 167819, 226975, 221486, 218124, 220957, // Gul'dan
    ];

    private sortEvents(events: FightEvent[]): FightEvent[] {
        return events.sort((a: any, b: any) => {
            let sort = a.timestamp - b.timestamp;

            if (a["sequence"] && b["sequence"]) {
                sort = sort || a.sequence - b.sequence;
            }

            return sort;
        });
    }

}
