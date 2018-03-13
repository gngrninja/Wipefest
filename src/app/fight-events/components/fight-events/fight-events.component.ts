import { Component, Input, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { EventConfig } from "app/event-config/event-config";
import { LoggerService } from "app/shared/logger.service";
import { Fight } from "app/warcraft-logs/report";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { FightEvent } from "../../models/fight-event";
import { PhaseChangeEvent } from "../../models/phase-change-event";
import { EndOfFightEvent } from "../../models/end-of-fight-event";
import { environment } from "environments/environment";
import { StateService } from "app/shared/state.service";

@Component({
    selector: 'fight-events',
    templateUrl: './fight-events.component.html',
    styleUrls: ['./fight-events.component.scss']
})
export class FightEventsComponent implements AfterViewInit, OnChanges {

    @Input() fight: Fight;
    @Input() events: FightEvent[];
    @Input() configs: EventConfig[];
    @ViewChild('tabs') tabs;

    view = FightEventsView.Table;
    FightEventsView = FightEventsView;

    constructor(
        private warcraftLogsService: WarcraftLogsService,
        private stateService: StateService,
        private logger: LoggerService) { }

    ngAfterViewInit() {
        setTimeout(() => this.selectDefaultTab(), 1);
    }

    ngOnChanges() {
        if (this.events && this.stateService.phases.length > 0) {
            if (this.stateService.phases.every(phase => this.events.find(event => event.config && event.config.group == phase.group) != undefined)) {
                let phaseEvents = this.events
                    .filter(x => x.config && x.config.eventType == "phase")
                    .map(x => <PhaseChangeEvent>x);
                let timestamp = 0;
                for (let i = 0; i < this.stateService.phases.length; i++) {
                    let phase = this.stateService.phases[i];
                    let event = phaseEvents
                        .find(x => x.timestamp >= timestamp && x.config.id == phase.id && x.config.group == phase.group);
                    if (event) {
                        event.show = phase.selected;
                        timestamp = event.timestamp;
                    }
                }
            }
        }
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
        var shownEvents = this.events.filter(x => !this.eventIsFiltered(x) && !this.eventIsHidden(x))

        if (!environment.production) {
            //console.log(shownEvents);
        }

        return shownEvents;
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
}

export class Interval {
    constructor(
        public start: number,
        public end: number) { }
}

export enum FightEventsView {
    Timeline, Table
}
