import { Component, Input } from '@angular/core';
import { EventConfig } from "app/event-config/event-config";

@Component({
    selector: 'fight-summary-filters',
    templateUrl: './fight-summary-filters.component.html',
    styleUrls: ['./fight-summary-filters.component.css']
})
export class FightSummaryFiltersComponent {

    @Input() configs: EventConfig[];

    getTags(): string[][] {
        return this.configs
            .map(config => config.tags)
            .filter((tags, index, array) => {
                let arrayOfJoinedTags = array.map(x => x.join(" "));
                return arrayOfJoinedTags.indexOf(tags.join(" ")) == index;
            })
            .sort();
    }

    getEventConfigsForTags(tags: string[]): EventConfig[] {
        return this.configs
            .filter(config => config.tags.every(tag => tags.indexOf(tag) != -1))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

}