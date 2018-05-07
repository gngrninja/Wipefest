import { TitleEvent } from './title-event';

export class EndOfFightEvent extends TitleEvent {
  constructor(public timestamp: number, public kill: boolean) {
    super(timestamp, kill ? 'Kill' : 'Wipe');
  }
}
