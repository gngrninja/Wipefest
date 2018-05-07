import { FightEvent } from 'app/fight-events/models/fight-event';
import { Raid } from 'app/raid/raid';
import { Fight, Report } from 'app/warcraft-logs/report';

export class InsightContext {
  constructor(
    public report: Report,
    public fight: Fight,
    public raid: Raid,
    public events: FightEvent[]
  ) {}
}
