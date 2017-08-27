import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FightEvent } from "app/fight-events/fight-event";
import { AbilityEvent } from "app/fight-events/ability-event";
import { DebuffEvent } from "app/fight-events/debuff-event";
import { DeathEvent } from "app/fight-events/death-event";
import { PhaseChangeEvent } from "app/fight-events/phase-change-event";
import { SpawnEvent } from "app/fight-events/spawn-event";
import { HeroismEvent } from "app/fight-events/heroism-event";
import { EndOfFightEvent } from "app/fight-events/end-of-fight-event";
import { EventConfig } from "app/event-config/event-config";
import { LoggerService } from "app/shared/logger.service";
import { Fight } from "app/warcraft-logs/report";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { Difficulty } from "app/helpers/difficulty-helper";

@Component({
    selector: 'fight-events',
    templateUrl: './fight-events.component.html',
    styleUrls: ['./fight-events.component.scss']
})
export class FightEventsComponent implements AfterViewInit {

    @Input() fight: Fight;
    @Input() events: FightEvent[];
    @ViewChild('tabs') tabs;

    view = FightEventsView.Table;

    AbilityEvent = AbilityEvent;
    DebuffEvent = DebuffEvent;
    DeathEvent = DeathEvent;
    PhaseChangeEvent = PhaseChangeEvent;
    SpawnEvent = SpawnEvent;
    HeroismEvent = HeroismEvent;
    EndOfFightEvent = EndOfFightEvent;
    FightEventsView = FightEventsView;

    constructor(private warcraftLogsService: WarcraftLogsService, private logger: LoggerService) { }

    ngAfterViewInit() {
        setTimeout(() => this.selectDefaultTab(), 1);
    }

    get hiddenIntervals(): Interval[] {
        return this.events
            .filter(x => x.isInstanceOf(PhaseChangeEvent) || x.isInstanceOf(EndOfFightEvent))
            .map((x, index, array) => {
                if (x.isInstanceOf(PhaseChangeEvent)) {
                    let phase = <PhaseChangeEvent>x;
                    if (!phase.show) {
                        return new Interval(x.timestamp, array[index + 1].timestamp);
                    }
                }
                return null;
            })
            .filter(x => x != null);
    }

    get shownEvents(): FightEvent[] {
        return this.events
            .filter(x => !this.eventIsFiltered(x) && !this.eventIsHidden(x));
    }

    selectDefaultTab() {
        if (window.innerWidth < 1300) {
            this.tabs.select("table-tab");
        }
    }

    private eventIsFiltered(event: FightEvent): boolean {
        return event.config && !event.config.show;
    }

    private eventIsHidden(event: FightEvent): boolean {
        return !event.isInstanceOf(PhaseChangeEvent) &&
            !event.isInstanceOf(EndOfFightEvent) &&
            this.hiddenIntervals.some(i => i.start <= event.timestamp && i.end >= event.timestamp);
    }

    togglePhaseCollapse(event: PhaseChangeEvent) {
        event.show = !event.show;
        this.logger.logTogglePhase(Difficulty.ToString(this.fight.difficulty), this.warcraftLogsService.getEncounter(this.fight.boss).name, event.title, event.show);
    }

    isTitle(event: FightEvent): boolean {
        return event.isInstanceOf(PhaseChangeEvent) || event.isInstanceOf(EndOfFightEvent);
    }
}

export class Interval {
    constructor(
        public start: number,
        public end: number) { }
}

export enum FightEventsView {
    Timeline, Table
}