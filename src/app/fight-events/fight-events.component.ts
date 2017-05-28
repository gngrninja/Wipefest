import { Component, Input } from '@angular/core';
import { FightEvent } from "app/fight-events/fight-event";
import { AbilityEvent } from "app/fight-events/ability-event";
import { DeathEvent } from "app/fight-events/death-event";
import { PhaseChangeEvent } from "app/fight-events/phase-change-event";
import { SpawnEvent } from "app/fight-events/spawn-event";

@Component({
    selector: 'fight-events',
    templateUrl: './fight-events.component.html',
    styleUrls: ['./fight-events.component.css']
})
export class FightEventsComponent {

    @Input() events: FightEvent[];
    
    AbilityEvent = AbilityEvent;
    DeathEvent = DeathEvent;
    PhaseChangeEvent = PhaseChangeEvent;
    SpawnEvent = SpawnEvent;

}
