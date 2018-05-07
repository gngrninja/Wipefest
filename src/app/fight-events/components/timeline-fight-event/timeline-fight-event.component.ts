import { Component } from '@angular/core';
import { FightEventComponent } from '../fight-event/fight-event.component';

@Component({
  selector: '[timeline-fight-event]',
  templateUrl: './timeline-fight-event.component.html',
  styleUrls: [
    '../fight-event/fight-event.component.scss',
    './timeline-fight-event.component.scss'
  ]
})
export class TimelineFightEventComponent extends FightEventComponent {}
