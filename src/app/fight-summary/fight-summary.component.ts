﻿import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Report, Fight } from "app/warcraft-logs/report";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { CombatEvent } from "app/warcraft-logs/combat-event";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { WipefestService } from "app/wipefest.service";
import { FightEvent } from "app/fight-events/fight-event";
import { AbilityEvent, Ability } from "app/fight-events/ability-event";
import { DeathEvent } from "app/fight-events/death-event";
import { PhaseChangeEvent } from "app/fight-events/phase-change-event";

@Component({
    selector: 'fight-summary',
    templateUrl: './fight-summary.component.html',
    styleUrls: ['./fight-summary.component.css']
})
export class FightSummaryComponent implements OnInit {

    private report: Report;
    private fight: Fight;

    private events: FightEvent[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private wipefestService: WipefestService,
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
            }, () => this.router.navigate([""]));
    }

    private selectReport(report: Report) {
        this.report = report;
        if (this.report) {
            this.report.fights = this.report.fights
                //.filter(x => x.boss == 1866)
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
            this.populatePhaseChangeEvents();
            this.populateAbilityEvents();
            this.populateDeathEvents();
        }
    }

    private populatePhaseChangeEvents() {
        if (this.fight.boss == 1866 && this.fight.difficulty == 5) { // Mythic Gul'dan
            let phaseChangeEvents = [];
            phaseChangeEvents.push(new PhaseChangeEvent(0, 1));

            this.warcraftLogsService
                .getCombatEvents(
                this.report.id,
                this.fight.start_time,
                this.fight.end_time,
                this.getCombatEventFilter([227427, 211439]))
                .subscribe(combatEvents => {
                    let phaseTwoCombatEvents = combatEvents.filter(x => x.ability.guid == 227427);
                    if (phaseTwoCombatEvents.length > 0) {
                        phaseChangeEvents.push(new PhaseChangeEvent(phaseTwoCombatEvents[0].timestamp - this.fight.start_time, 2));
                    }

                    let phaseThreeCombatEvents = combatEvents.filter(x => x.ability.guid == 211439);
                    if (phaseThreeCombatEvents.length > 0) {
                        phaseChangeEvents.push(new PhaseChangeEvent(phaseThreeCombatEvents[0].timestamp - this.fight.start_time, 3));
                    }

                    this.events = this.events.concat(phaseChangeEvents).sort((a, b) => a.timestamp - b.timestamp);
                },
                () => this.router.navigate([""]));
        }
    }

    private populateAbilityEvents() {
        this.warcraftLogsService
            .getCombatEvents(
            this.report.id,
            this.fight.start_time,
            this.fight.end_time,
            this.getAbilityEventsFilter())
            .subscribe(combatEvents =>
                this.events = this.events.concat(
                    combatEvents.map(
                        x => new AbilityEvent(
                            x.timestamp - this.fight.start_time,
                            x.sourceIsFriendly,
                            this.getCombatEventSource(x).name,
                            new Ability(x.ability),
                            combatEvents.filter(y => y.ability.name == x.ability.name && y.timestamp < x.timestamp).length + 1)))
                    .sort((a, b) => a.timestamp - b.timestamp),
            () => this.router.navigate([""]));
    }

    private populateDeathEvents() {
        this.warcraftLogsService
            .getDeaths(
            this.report.id,
            this.fight.start_time,
            this.fight.end_time)
            .subscribe(deaths =>
                this.events = this.events.concat(
                    deaths.map(
                        death => new DeathEvent(
                            death.timestamp - this.fight.start_time,
                            true,
                            death.name,
                            death.events && death.events[0] && death.events[0].ability ? new Ability(death.events[0].ability) : null)))
                    .sort((a, b) => a.timestamp - b.timestamp),
            () => this.router.navigate([""]));
    }

    private raidCooldownIds = [31821, 62618, 98008, 97462, 64843, 108280, 740, 115310, 15286, 196718, 206222];
    private guldanAbilityIds = [206222, 212258, 209270, 206219, 206221, 206220, 221783, 211152, 206939, 206744, 167819, 221408, 208801, 226975, 221486, 30449, 218124];

    private getCombatEventFilter(abilityIds: number[]): string {
        const filter = `type = 'cast' and ability.id in (${abilityIds.join(", ")})`;

        return filter;
    }

    private getAbilityEventsFilter(): string {
        return this.getCombatEventFilter(this.raidCooldownIds.concat(this.guldanAbilityIds));
    }

    private getCombatEventSource(event: CombatEvent) {
        if (event.sourceIsFriendly) {
            return this.report.friendlies.filter(x => x.id === event.sourceID)[0];
        } else {
            return this.report.enemies.filter(x => x.id === event.sourceID)[0];
        }
    }

}
