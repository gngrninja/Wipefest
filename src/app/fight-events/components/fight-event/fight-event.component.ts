import { Component, Input } from '@angular/core';
import { Difficulty } from 'app/helpers/difficulty-helper';
import { MarkupParser } from 'app/helpers/markup-parser';
import { LoggerService } from 'app/shared/logger.service';
import { StateService } from 'app/shared/state.service';
import { Fight } from 'app/warcraft-logs/report';
import { WarcraftLogsService } from 'app/warcraft-logs/warcraft-logs.service';
import { MarkupHelper } from '../../../helpers/markup-helper';
import { Actor } from '../../../warcraft-logs/report';
import { AbilityEvent } from '../../models/ability-event';
import { DamageEvent } from '../../models/damage-event';
import { DeathEvent } from '../../models/death-event';
import { DebuffEvent } from '../../models/debuff-event';
import { DebuffStackEvent } from '../../models/debuff-stack-event';
import { EndOfFightEvent } from '../../models/end-of-fight-event';
import { FightEvent } from '../../models/fight-event';
import { HeroismEvent } from '../../models/heroism-event';
import { InterruptEvent } from '../../models/interrupt-event';
import { PhaseChangeEvent } from '../../models/phase-change-event';
import { RemoveDebuffEvent } from '../../models/remove-debuff-event';
import { SpawnEvent } from '../../models/spawn-event';
import { TitleEvent } from '../../models/title-event';

@Component({
  template: `Warning: Instead of using FightEventComponent, use one of its children`
})
export class FightEventComponent {
  @Input() fight: Fight;
  @Input() event: FightEvent;
  @Input() events: FightEvent[];

  TitleEvent = TitleEvent;
  AbilityEvent = AbilityEvent;
  InterruptEvent = InterruptEvent;
  DamageEvent = DamageEvent;
  DebuffEvent = DebuffEvent;
  DebuffStackEvent = DebuffStackEvent;
  RemoveDebuffEvent = RemoveDebuffEvent;
  DeathEvent = DeathEvent;
  PhaseChangeEvent = PhaseChangeEvent;
  SpawnEvent = SpawnEvent;
  HeroismEvent = HeroismEvent;
  EndOfFightEvent = EndOfFightEvent;

  constructor(
    private warcraftLogsService: WarcraftLogsService,
    private stateService: StateService,
    private logger: LoggerService
  ) {}

  togglePhaseCollapse(event: PhaseChangeEvent) {
    event.show = !event.show;
    this.stateService.selectPhasesFromEvents(this.events);
    this.logger.logTogglePhase(
      Difficulty.ToString(this.fight.difficulty),
      this.warcraftLogsService.getEncounter(this.fight.boss).name,
      event.title,
      event.show
    );
  }

  isTitle(event: FightEvent): boolean {
    return (
      event.isInstanceOf(PhaseChangeEvent) || event.isInstanceOf(TitleEvent)
    );
  }

  parse(input: string): string {
    if (
      input.indexOf('{target}') !== -1 &&
      this.event.hasOwnProperty('target')
    ) {
      input = input
        .split('{target}')
        .join(MarkupHelper.Actor((this.event as any).target as Actor));
    }

    return MarkupParser.Parse(input);
  }
}
