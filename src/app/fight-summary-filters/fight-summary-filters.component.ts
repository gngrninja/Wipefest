import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { EventConfig } from "app/event-config/event-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { LoggerService } from "app/shared/logger.service";
import { Ability } from "../fight-events/models/ability-event";
import { StateService, SelectedFilter } from "app/shared/state.service";
import { Fight } from "app/warcraft-logs/report";

@Component({
    selector: 'fight-summary-filters',
    templateUrl: './fight-summary-filters.component.html',
    styleUrls: ['./fight-summary-filters.component.scss']
})
export class FightSummaryFiltersComponent implements OnChanges {

    @Input() configs: EventConfig[];
    @Input() events: FightEvent[] = [];
    categories: EventConfigCategory[] = [];
    categoryFilter: string = "";

    get uniqueConfigs(): EventConfig[] {
        return this.configs.filter(
            (config, index, array) =>
                array.findIndex(
                    x =>
                        x.name == config.name &&
                        x.tags.join(" ") == config.tags.join(" ")) == index);
    }

    constructor(private stateService: StateService, private readonly logger: LoggerService) {
    }

    ngOnChanges() {
        if (this.configs && this.stateService.filters.length > 0) {
            if (this.stateService.filters.every(filter => this.configs.find(config => config.group == filter.group) != undefined)) {
                this.configs.filter(x => x.eventType != "phase" && x.eventType != "title").forEach(x => x.show = false);
                for (let i = 0; i < this.stateService.filters.length; i++) {
                    let filter = this.stateService.filters[i];
                    let config = this.configs.find(x => x.id == filter.id && x.group == filter.group);
                    if (config) {
                        config.show = true;
                    }
                }
            }
        }

        this.categories = this.getFilteredCategories();
    }

    showAll() {
        this.configs.forEach(x => x.show = true);
        this.stateService.selectFiltersFromConfigs(this.configs);
        this.logger.logShowAllFilters();
    }

    hideAll() {
        this.configs.filter(x => ["phase", "title"].indexOf(x.eventType) == -1).forEach(x => x.show = false);
        this.stateService.selectFiltersFromConfigs(this.configs);
        this.logger.logHideAllFilters();
    }

    reset() {
        this.configs.forEach(x => {
            x.show = x.showByDefault;
        });
        this.stateService.selectFiltersFromConfigs(this.configs);
        this.logger.logResetFilters();
    }

    getFilteredCategories(): EventConfigCategory[] {
        let categories = [];
        const tagss = this.getTags();

        tagss.forEach(tags => {
            let filteredCategories = categories;
            let currentTags = [];
            tags.forEach(tag => {
                currentTags.push(tag);
                let category = filteredCategories.find(x => x.name == tag);
                if (category) {
                    filteredCategories = category.categories;
                } else {
                    let configs = this.getEventConfigsForTags(currentTags);
                    if (this.categoryFilter) {
                        configs = configs.filter(x =>
                            x.name.toLowerCase().indexOf(this.categoryFilter.toLowerCase()) != -1 ||
                            x.tags.some(x => x.toLowerCase().indexOf(this.categoryFilter.toLowerCase()) != -1));
                    }
                    let filters = configs.map(config => {
                        let events: any[] = this.getEventsForEventConfig(config);
                        let eventWithAbility = events.find(x => x.ability);
                        if (eventWithAbility) {
                            let ability: Ability = eventWithAbility.ability;
                            return new EventConfigFilter(config, ability.guid, ability.abilityIcon, events.length, this.configs);
                        }
                        return new EventConfigFilter(config, null, null, events.length, this.configs);
                    });
                    filteredCategories.push(new EventConfigCategory(currentTags.length, tag, filters));
                    filteredCategories = filteredCategories[filteredCategories.length - 1].categories;
                }
            });
        });

        categories = categories.filter(x => ["phase", "title"].indexOf(x.name) == -1);

        return categories;
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

    getEventsForEventConfig(config: EventConfig) {
        return this.events.filter(x => x.config != null && x.config.name == config.name && x.config.tags.join(" ") == config.tags.join(" "));
    }

}

export class EventConfigDefaultVisbility {

    constructor(public name: string, public tags: string[], public show: boolean) { }

}

export class EventConfigCategory {

    constructor(
        public depth: number,
        public name: string,
        public filters: EventConfigFilter[],
        public categories: EventConfigCategory[] = []) {
    }

    get hasFilters(): boolean {
        return this.filters.length > 0 || (this.categories.some(x => this.categoryHasFilters(x)));
    }

    private categoryHasFilters(category: EventConfigCategory) {
        return category.filters.length > 0 || (category.categories.some(x => this.categoryHasFilters(x)));
    }

}

export class EventConfigFilter {

    constructor(
        public config: EventConfig,
        public abilityId: number,
        public abilityIcon: string,
        public count: number,
        public configs: EventConfig[]) { }

}
