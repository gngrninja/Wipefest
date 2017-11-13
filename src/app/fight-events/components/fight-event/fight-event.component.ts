import { Component, Input, ViewChild } from '@angular/core';
import { FightEvent } from "../../models/fight-event";
import { TitleEvent } from "../../models/title-event";
import { AbilityEvent } from "../../models/ability-event";
import { InterruptEvent } from "../../models/interrupt-event";
import { DamageEvent } from "../../models/damage-event";
import { DebuffEvent } from "../../models/debuff-event";
import { DebuffStackEvent } from "../../models/debuff-stack-event";
import { RemoveDebuffEvent } from "../../models/remove-debuff-event";
import { DeathEvent } from "../../models/death-event";
import { PhaseChangeEvent } from "../../models/phase-change-event";
import { SpawnEvent } from "../../models/spawn-event";
import { HeroismEvent } from "../../models/heroism-event";
import { EndOfFightEvent } from "../../models/end-of-fight-event";
import { LoggerService } from "app/shared/logger.service";
import { Fight } from "app/warcraft-logs/report";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { Difficulty } from "app/helpers/difficulty-helper";
import { MarkupParser } from "app/helpers/markup-parser";

@Component({
    template: `Warning: Instead of using FightEventComponent, use one of its children`
})
export class FightEventComponent {
    
    @Input() fight: Fight;
    @Input() event: FightEvent;

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

    constructor(private warcraftLogsService: WarcraftLogsService, private logger: LoggerService) { }

    togglePhaseCollapse(event: PhaseChangeEvent) {
        event.show = !event.show;
        this.logger.logTogglePhase(Difficulty.ToString(this.fight.difficulty), this.warcraftLogsService.getEncounter(this.fight.boss).name, event.title, event.show);
    }

    isTitle(event: FightEvent): boolean {
        return event.isInstanceOf(PhaseChangeEvent) || event.isInstanceOf(TitleEvent);
    }

    parse(input: string): string {
        return MarkupParser.Parse(input);
    }
}
