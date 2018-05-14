import { Component, Input } from '@angular/core';
import { Difficulty } from 'app/helpers/difficulty-helper';
import { MarkupParser } from 'app/helpers/markup-parser';
import { LoggerService } from 'app/shared/logger.service';
import { StateService } from 'app/shared/state.service';
import { MarkupHelper } from '../../../helpers/markup-helper';
import {
  EventDto,
  FightInfo,
  EventConfig
} from '@wipefest/api-sdk/dist/lib/models';
import { EncountersService } from '@wipefest/core';
import { Ability } from '../../models/ability-event';

@Component({
  template: `Warning: Instead of using FightEventComponent, use one of its children`
})
export class FightEventComponent {
  @Input() fight: FightInfo;
  @Input() event: EventDto;
  @Input() ability: Ability;
  @Input() events: EventDto[];
  @Input() configs: EventConfig[];

  collapsed: boolean = true;

  constructor(
    private encountersService: EncountersService,
    private stateService: StateService,
    private logger: LoggerService
  ) {}

  togglePhaseCollapse(event: EventDto): void {
    const config = this.getConfig(event);
    config.show = !config.show;
    this.stateService.selectPhasesFromEvents(this.events);
    this.logger.logTogglePhase(
      Difficulty.ToString(this.fight.difficulty),
      this.encountersService.getEncounter(this.fight.boss).name,
      event.title,
      config.show
    );
  }

  isTitle(event: EventDto): boolean {
    return event.type === 'phase' || event.type === 'title';
  }

  parse(input: string): string {
    return MarkupParser.Parse(input);
  }

  canCollapse(event: EventDto): boolean {
    return event.childEvents.length > 0 || event.details != null;
  }

  getConfig(event: EventDto): EventConfig {
    return this.configs.find(
      x => x.id === event.configId && x.group === event.configGroup
    );
  }

  rowClasses(event: EventDto): string {
    const config = this.getConfig(event);

    if (!config) return event.type;

    return event.type + ' ' + config.style;
  }
}
