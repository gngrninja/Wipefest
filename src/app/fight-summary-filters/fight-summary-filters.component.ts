import { Component, Input } from '@angular/core';
import { EventConfig } from "app/event-config/event-config";

@Component({
    selector: 'fight-summary-filters',
    templateUrl: './fight-summary-filters.component.html',
    styleUrls: ['./fight-summary-filters.component.css']
})
export class FightSummaryFiltersComponent {

    @Input() configs: EventConfig[];

    getEventTypes(): string[] {
        return this.configs.map(config => config.eventType).filter((config, index, array) => array.indexOf(config) == index).sort();
    }

    getEventConfigsForEventType(eventType: string): EventConfig[] {
        return this.configs.filter(config => config.eventType == eventType).sort((a, b) => a.name.localeCompare(b.name));
    }

}
