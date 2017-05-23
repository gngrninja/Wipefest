import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Report, Fight } from "app/warcraft-logs/report";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { CombatEvent } from "app/warcraft-logs/combat-event";

@Component({
    selector: 'fight-summary',
    templateUrl: './fight-summary.component.html',
    styleUrls: ['./fight-summary.component.css']
})
export class FightSummaryComponent implements OnInit, OnChanges {

    @Input() report: Report;
    @Input() fight: Fight;

    private events: CombatEvent[];

    constructor(private warcraftLogsService: WarcraftLogsService) { }

    ngOnInit() {
        this.warcraftLogsService.events.subscribe(events => this.events = events);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.report && this.fight) {
            this.events = null;
            this.warcraftLogsService.getEvents(this.report.id, this.fight.start_time, this.fight.end_time, this.getEventFilter());
        }
    }

    private raidCooldownIds = [31821, 62618, 98008, 97462, 64843, 108280, 740, 115310, 15286, 196718, 206222];
    private guldanAbilityIds = [206222, 212258, 209270, 206219, 206221, 206220, 227427, 221783, 211152, 206939, 206744, 167819, 211439, 221408, 208801, 226975, 221486, 30449];

    private getEventFilter(): string {
        const filter = `type = 'cast' and ability.id in (${this.raidCooldownIds.join(", ")}, ${this.guldanAbilityIds.join(", ")})`;

        return filter;
    }

}
