import { Component, Input, OnChanges } from '@angular/core';
import { EventConfig } from "app/event-config/event-config";
import { FightEvent } from "app/fight-events/fight-event";

@Component({
    selector: 'fight-summary-filters',
    templateUrl: './fight-summary-filters.component.html',
    styleUrls: ['./fight-summary-filters.component.css']
})
export class FightSummaryFiltersComponent implements OnChanges {

    @Input() configs: EventConfig[];
    @Input() events: FightEvent[];

    private defaultVisibilities: EventConfigDefaultVisbility[];

    ngOnChanges() {
        this.defaultVisibilities = this.configs.map(x => new EventConfigDefaultVisbility(x.name, x.show));
    }

    showAll() {
        this.configs.forEach(x => x.show = true);
    }

    hideAll() {
        this.configs.forEach(x => x.show = false);
    }

    reset() {
        this.configs.forEach(x => {
            let match = this.defaultVisibilities.find(y => y.name == x.name);
            if (match) {
                x.show = match.show;
            }
        });
    }

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

    getButtonClass(config: EventConfig) {
        var classes = "btn btn-sm mb-1 mr-1 ";
        return config.show ? classes + "btn-primary" : classes + "btn-secondary";
    }

}

export class EventConfigDefaultVisbility {

    constructor(public name: string, public show: boolean) { }

}