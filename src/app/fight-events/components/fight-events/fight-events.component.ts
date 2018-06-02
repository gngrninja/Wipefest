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
export class FightEventsComponent implements AfterViewInit {
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

  getHiddenIntervals(): Interval[] {
    if (this.events.length === 0) return [];

    const phaseEvents = this.events.filter(
      x => x.type === 'phase' || x.type === 'endOfFight'
    );

    const intervals = this.stateService.phases
      .filter(
        selectedPhase => selectedPhase.group === this.fight.boss.toString()
      )
      .slice(0, phaseEvents.length - 1)
      .map(selectedPhase => {
        return selectedPhase.selected
          ? null
          : new Interval(
              phaseEvents[selectedPhase.index].timestamp,
              phaseEvents[selectedPhase.index + 1].timestamp
            );
      })
      .filter(x => x !== null);

    return intervals;
  }

  get shownEvents(): EventDto[] {
    const hiddenIntervals = this.getHiddenIntervals();
    const shownEvents = this.events.filter(
      x =>
        x.type === 'phase' ||
        x.type === 'endOfFight' ||
        (!this.eventIsFiltered(x) && !this.eventIsHidden(x, hiddenIntervals))
    );

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

  private eventIsHidden(event: EventDto, hiddenIntervals: Interval[]): boolean {
    return hiddenIntervals.some(
      i => i.start <= event.timestamp && i.end >= event.timestamp
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
