import { EventConfig } from 'app/event-config/event-config';
import { MarkupHelper } from 'app/helpers/markup-helper';
import { Ability } from './ability-event';
import { FightEvent } from './fight-event';

export class HeroismEvent extends FightEvent {
  constructor(
    public config: EventConfig,
    public timestamp: number,
    public ability: Ability
  ) {
    super(config, timestamp, true, null, null);
  }

  rowClass = 'heroism';

  get title(): string {
    return MarkupHelper.Ability(this.ability);
  }
}
