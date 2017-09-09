import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FightEvent } from "../../models/fight-event";
import { TitleEvent } from "../../models/title-event";
import { AbilityEvent } from "../../models/ability-event";
import { DebuffEvent } from "../../models/debuff-event";
import { DeathEvent } from "../../models/death-event";
import { PhaseChangeEvent } from "../../models/phase-change-event";
import { SpawnEvent } from "../../models/spawn-event";
import { HeroismEvent } from "../../models/heroism-event";
import { EndOfFightEvent } from "../../models/end-of-fight-event";
import { LoggerService } from "app/shared/logger.service";
import { Fight } from "app/warcraft-logs/report";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { Difficulty } from "app/helpers/difficulty-helper";
import { FightEventComponent } from "../fight-event/fight-event.component";

@Component({
    selector: '[timeline-fight-event]',
    templateUrl: './timeline-fight-event.component.html',
    styleUrls: ['../fight-event/fight-event.component.scss', './timeline-fight-event.component.scss']
})
export class TimelineFightEventComponent extends FightEventComponent { }
