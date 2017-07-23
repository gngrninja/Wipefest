﻿import { Component, Input, OnChanges } from '@angular/core';
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

    get uniqueConfigs(): EventConfig[] {
        return this.configs.filter(
            (config, index, array) =>
                array.findIndex(
                    x =>
                        x.name == config.name &&
                        x.tags.join(" ") == config.tags.join(" ")) == index);
    }

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

    toggleConfig(config: EventConfig) {
        this.configs
            .filter(x => x.name == config.name &&
                x.tags.join(" ") == config.tags.join(" "))
            .forEach(x => x.show = !x.show);
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
        return this.uniqueConfigs
            .filter(config => config.tags.join(" ") == tags.join(" "))
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