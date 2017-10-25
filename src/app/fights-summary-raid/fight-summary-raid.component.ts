import { Component, Input, OnChanges } from '@angular/core';
import { CombatEvent } from "app/warcraft-logs/combat-event";
import { Specialization, ClassesService } from "app/warcraft-logs/classes.service";
import { Actor } from "app/warcraft-logs/report";
import { MarkupHelper } from "app/helpers/markup-helper";
import { MarkupParser } from "app/helpers/markup-parser";
import { Raid, RaidFactory } from "app/raid/raid";

@Component({
    selector: 'fight-summary-raid',
    templateUrl: './fight-summary-raid.component.html',
    styleUrls: ['./fight-summary-raid.component.css']
})
export class FightSummaryRaidComponent {

    MarkupHelper = MarkupHelper;
    MarkupParser = MarkupParser;

    @Input() raid: Raid;

    constructor() { }
}
