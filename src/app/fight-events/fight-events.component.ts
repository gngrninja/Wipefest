import { Component, Input } from '@angular/core';
import { FightEvent } from "app/fight-events/fight-event";
import { AbilityEvent } from "app/fight-events/ability-event";

@Component({
    selector: 'fight-events',
    templateUrl: './fight-events.component.html',
    styleUrls: ['./fight-events.component.css']
})
export class FightEventsComponent {

    @Input() events: FightEvent[];
    
    AbilityEvent = AbilityEvent;

}
