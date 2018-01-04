import { Component, Input, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { EventConfig } from "app/event-config/event-config";
import { LoggerService } from "app/shared/logger.service";
import { Fight } from "app/warcraft-logs/report";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { Difficulty } from "app/helpers/difficulty-helper";
import { FightEvent } from "../../models/fight-event";
import { PhaseChangeEvent } from "../../models/phase-change-event";
import { EndOfFightEvent } from "../../models/end-of-fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { MarkupParser } from "app/helpers/markup-parser";
import { DamageEvent } from "app/fight-events/models/damage-event";
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
        if (this.configs && this.stateService.phases.length > 0) {
            if (this.stateService.phases.every(phase => this.configs.find(config => config.group == phase.group) != undefined)) {
                this.events.filter(x => x.config && x.config.eventType == "phase").map(x => <PhaseChangeEvent>x).forEach(x => x.show = false);
                for (let i = 0; i < this.stateService.phases.length; i++) {
                    let phase = this.stateService.phases[i];
                    let config = this.configs.find(x => x.id == phase.id && x.group == phase.group);
                    if (config) {
                        config.show = true;
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
