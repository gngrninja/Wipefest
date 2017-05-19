import { Component, Input } from '@angular/core';
import { CombatEvent } from "../warcraft-logs-api/combat-event";
import { Report } from "../warcraft-logs-api/report";

@Component({
    selector: 'event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.css']
})
export class EventComponent {

    @Input()
    event: CombatEvent;

    @Input()
    report: Report;

    private source() {
        if (this.event.sourceIsFriendly) {
            return this.report.friendlies.filter(x => x.id === this.event.sourceID)[0];
        } else {
            return this.report.enemies.filter(x => x.id === this.event.sourceID)[0];
        }
    }

    private iconUrl() {
        return `https://www.warcraftlogs.com/img/icons/abilities/${this.event.ability.abilityIcon}`;
    }

    private initials(input: string): string {
        return input.split(" ").map(w => w[0]).join("");
    }

}
