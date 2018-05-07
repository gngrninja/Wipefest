import { EventConfig } from 'app/event-config/event-config';
import { FightEvent } from './fight-event';

export class PhaseChangeEvent extends FightEvent {
  constructor(
    public config: EventConfig,
    public timestamp: number,
    public phase: string,
    public show: boolean = true
  ) {
    super(config, timestamp, null, null, null);
  }

  get title(): string {
    return this.phase + ' (' + this.minutesAndSeconds + ')';
  }
}
