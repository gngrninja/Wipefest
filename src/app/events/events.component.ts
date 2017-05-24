import { Component, Input } from '@angular/core';
import { CombatEvent } from "../warcraft-logs/combat-event"
import { WarcraftLogsService } from "../warcraft-logs/warcraft-logs.service";
import { Report, Fight } from "../warcraft-logs/report";

@Component({
    selector: 'events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css']
})
export class EventsComponent {

    @Input() events: CombatEvent[];
    @Input() fight: Fight;
    @Input() report: Report;
    
    private source(event: CombatEvent) {
        if (event.sourceIsFriendly) {
            return this.report.friendlies.filter(x => x.id === event.sourceID)[0];
        } else {
            return this.report.enemies.filter(x => x.id === event.sourceID)[0];
        }
    }

    private iconUrl(event: CombatEvent) {
        return `https://www.warcraftlogs.com/img/icons/abilities/${event.ability.abilityIcon}`;
    }

    private initials(input: string): string {
        return input.split(" ").map(w => w[0]).join("");
    }

    private formatTimestamp(timestamp: number): string {
        let minutes = Math.floor(timestamp / 60000);
        let seconds = Math.floor(timestamp / 1000) - 60 * minutes;

        return minutes + ":" + ("00" + seconds).substring(seconds.toString().length);
    }
}
