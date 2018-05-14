import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
import { LoggerService } from 'app/shared/logger.service';
import { StateService } from 'app/shared/state.service';
import { environment } from 'environments/environment';
import {
  FightInfo,
  EventDto,
  EventConfig,
  Ability
} from '@wipefest/api-sdk/dist/lib/models';

@Component({
  selector: 'fight-events',
  templateUrl: './fight-events.component.html',
  styleUrls: ['./fight-events.component.scss']
})
export class FightEventsComponent implements AfterViewInit, OnChanges {
  @Input() fight: FightInfo;
  @Input() events: EventDto[];
  @Input() configs: EventConfig[] = [];
  @Input() abilities: Ability[] = [];
  @ViewChild('tabs') tabs: any;

  view: FightEventsView = FightEventsView.Table;
  FightEventsView: any = FightEventsView;

  constructor(
    private stateService: StateService,
    private logger: LoggerService
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.selectDefaultTab(), 1);
  }

  ngOnChanges(): void {
    if (this.events && this.stateService.phases.length > 0) {
      if (
        this.stateService.phases.every(
          phase =>
            this.events.find(
              event => event.configId && event.configGroup === phase.group
            ) != undefined
        )
      ) {
        const phaseEvents = this.events.filter(x => x.type === 'phase');
        let timestamp = 0;
        for (let i = 0; i < this.stateService.phases.length; i++) {
          const phase = this.stateService.phases[i];
          const event = phaseEvents.find(
            x =>
              x.timestamp >= timestamp &&
              x.configId === phase.id &&
              x.configGroup === phase.group
          );
          if (event) {
            this.getConfig(event).show = phase.selected;
            timestamp = event.timestamp;
          }
        }
      }
    }
  }

  get hiddenIntervals(): Interval[] {
    return this.events
      .filter(x => x.type === 'phase' || x.type === 'endOfFight')
      .map((x, index, array) => {
        if (x.type === 'phase') {
          const phase = x;
          if (this.configs.length > 0 && !this.getConfig(phase).show) {
            return new Interval(x.timestamp, array[index + 1].timestamp);
          }
        }
        return null;
      })
      .filter(x => x != null);
  }

  get shownEvents(): EventDto[] {
    const shownEvents = this.events.filter(
      x => !this.eventIsFiltered(x) && !this.eventIsHidden(x)
    );

    if (!environment.production) {
      // console.log(shownEvents);
    }

    return shownEvents;
  }

  selectDefaultTab(): void {
    if (window.innerWidth < 1300) {
      this.tabs.select('table-tab');
    }
  }

  getAbility(event: EventDto): Ability {
    return this.abilities.find(x => x.guid === event.abilityGuid);
  }

  private eventIsFiltered(event: EventDto): boolean {
    return (
      this.configs.length > 0 && event.configId && !this.getConfig(event).show
    );
  }

  private eventIsHidden(event: EventDto): boolean {
    return (
      !(event.type === 'phase') &&
      !(event.type === 'endOfFight') &&
      this.hiddenIntervals.some(
        i => i.start <= event.timestamp && i.end >= event.timestamp
      )
    );
  }

  private getConfig(event: EventDto): EventConfig {
    return this.configs.find(
      x => x.id === event.configId && x.group === event.configGroup
    );
  }
}

export class Interval {
  constructor(public start: number, public end: number) {}
}

export enum FightEventsView {
  Timeline,
  Table
}
