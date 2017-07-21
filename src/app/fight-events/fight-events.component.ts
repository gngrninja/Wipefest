import { Component, Input } from '@angular/core';
import { FightEvent } from "app/fight-events/fight-event";
import { AbilityEvent } from "app/fight-events/ability-event";
import { DebuffEvent } from "app/fight-events/debuff-event";
import { DeathEvent } from "app/fight-events/death-event";
import { PhaseChangeEvent } from "app/fight-events/phase-change-event";
import { SpawnEvent } from "app/fight-events/spawn-event";
import { HeroismEvent } from "app/fight-events/heroism-event";
import { EventConfig } from "app/event-config/event-config";

@Component({
    selector: 'fight-events',
    templateUrl: './fight-events.component.html',
    styleUrls: ['./fight-events.component.css']
})
export class FightEventsComponent {
    
    @Input() events: FightEvent[];

    get shownEvents(): FightEvent[] {
        return this.events.filter(x => !x.config || x.config.show);
    }

    AbilityEvent = AbilityEvent;
    DebuffEvent = DebuffEvent;
    DeathEvent = DeathEvent;
    PhaseChangeEvent = PhaseChangeEvent;
    SpawnEvent = SpawnEvent;
    HeroismEvent = HeroismEvent;

}
