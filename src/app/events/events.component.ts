import { Component, Input } from '@angular/core';
import { CombatEvent } from "../warcraft-logs-api/combat-event"

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {

  @Input()
  events: CombatEvent[];

  private parseTimestamp(timestamp: number) {
    let minutes = Math.floor(timestamp / 60000);
    let seconds = Math.floor(timestamp / 1000) - 60 * minutes;
    let milliseconds = timestamp % 1000;

    return minutes + ":" + seconds + "." + milliseconds;
  }

}
