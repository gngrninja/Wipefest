import { Component, Input, SimpleChanges } from '@angular/core';
import { Difficulty } from 'app/helpers/difficulty-helper';
import { LoggerService } from 'app/shared/logger.service';
import { StateService } from 'app/shared/state.service';
import {
  Ability,
  EventDto,
  FightInfo,
  EventConfig
} from '@wipefest/api-sdk/dist/lib/models';
import { EncountersService, MarkupParser } from '@wipefest/core';

@Component({
  template: `Warning: Instead of using FightEventComponent, use one of its children`
})
export class FightEventComponent {
  @Input() fight: FightInfo;
  @Input() event: EventDto;
  @Input() abilities: Ability[];
  @Input() ability: Ability;
  @Input() events: EventDto[];
  @Input() configs: EventConfig[];
  @Input() trackState: boolean = true;

  collapsed: boolean = true;

  constructor(
    private encountersService: EncountersService,
    private stateService: StateService,
    private logger: LoggerService
  ) { }

  ngOnInit(): void {
    if (!this.trackState)
      return;
      
    this.stateService.changes.take(1).subscribe(() => {
      if (this.event.type === 'phase') {
        const phaseEvents = this.events.filter(x => x.type === 'phase');
        const phaseIndex = phaseEvents.findIndex(
          x => x.timestamp === this.event.timestamp
        );
        const selectedPhases = this.stateService.phases.filter(
          x => x.group === this.event.configGroup
        );
        this.collapsed =
          selectedPhases[phaseIndex] !== undefined
            ? selectedPhases[phaseIndex].selected
            : true;
      }
    });
  }

  togglePhaseCollapse(event: EventDto): void {
    if (!this.trackState)
      return;

    const phases = this.events.filter(x => x.type === 'phase');
    const phaseIndex = phases.findIndex(x => x.timestamp === event.timestamp);
    this.stateService.togglePhase(
      phaseIndex,
      phases[0].configGroup,
      phases.length
    );
  }

  isTitle(event: EventDto): boolean {
    return (
      event.type === 'phase' ||
      event.type === 'title' ||
      event.type === 'endOfFight' ||
      !event.type
    );
  }

  parse(input: string): string {
    return MarkupParser.Parse(input, MarkupParser.RuleSets.html);
  }

  canCollapse(event: EventDto): boolean {
    return event.childEvents.length > 0 || event.details != null;
  }

  getConfig(event: EventDto): EventConfig {
    return this.configs.find(
      x => x.id === event.configId && x.group === event.configGroup
    );
  }

  getAbility(event: EventDto): Ability {
    return this.abilities.find(x => x.guid === event.abilityGuid);
  }

  rowClasses(event: EventDto): string {
    const config = this.getConfig(event);

    if (!config) return event.type;

    return event.type + ' ' + config.style;
  }
}
