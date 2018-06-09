import { Component, Input, OnChanges } from '@angular/core';
import { LoggerService } from 'app/shared/logger.service';
import { StateService } from 'app/shared/state.service';
import {
  EventDto,
  EventConfig,
  Ability
} from '@wipefest/api-sdk/dist/lib/models';

@Component({
  selector: 'fight-summary-filters',
  templateUrl: './fight-summary-filters.component.html',
  styleUrls: ['./fight-summary-filters.component.scss']
})
export class FightSummaryFiltersComponent implements OnChanges {
  @Input() configs: EventConfig[];
  @Input() events: EventDto[] = [];
  @Input() abilities: Ability[] = [];
  @Input() trackState: boolean = true;
  categories: EventConfigCategory[] = [];
  categoryFilter: string = '';

  get uniqueConfigs(): EventConfig[] {
    return this.configs.filter(
      (config, index, array) =>
        array.findIndex(
          x =>
            x.name === config.name && x.tags.join(' ') === config.tags.join(' ')
        ) === index
    );
  }

  constructor(
    private stateService: StateService,
    private readonly logger: LoggerService
  ) {}

  ngOnChanges(): void {
    if (
      this.trackState &&
      this.configs &&
      this.stateService.filters.length > 0
    ) {
      if (
        this.stateService.filters.every(
          filter =>
            this.configs.find(config => config.group === filter.group) !=
            undefined
        )
      ) {
        this.configs
          .filter(x => x.eventType !== 'phase' && x.eventType !== 'title')
          .forEach(x => (x.show = false));
        for (let i = 0; i < this.stateService.filters.length; i++) {
          const filter = this.stateService.filters[i];
          const config = this.configs.find(
            x => x.id === filter.id && x.group === filter.group
          );
          if (config) {
            config.show = true;
          }
        }
      }
    }

    this.categories = this.getFilteredCategories();
  }

  showAll(): void {
    this.configs.forEach(x => (x.show = true));
    if (this.trackState)
      this.stateService.selectFiltersFromConfigs(this.configs);
    this.logger.logShowAllFilters();
  }

  hideAll(): void {
    this.configs
      .filter(x => ['phase', 'title'].indexOf(x.eventType) === -1)
      .forEach(x => (x.show = false));
    if (this.trackState)
      this.stateService.selectFiltersFromConfigs(this.configs);
    this.logger.logHideAllFilters();
  }

  reset(): void {
    this.configs.forEach(x => {
      x.show = x.showByDefault;
    });
    if (this.trackState)
      this.stateService.selectFiltersFromConfigs(this.configs);
    this.logger.logResetFilters();
  }

  getFilteredCategories(): EventConfigCategory[] {
    let categories = [];
    const tagss = this.getTags();

    tagss.forEach(tags => {
      let filteredCategories = categories;
      const currentTags = [];
      tags.forEach(tag => {
        currentTags.push(tag);
        const category = filteredCategories.find(x => x.name === tag);
        if (category) {
          filteredCategories = category.categories;
        } else {
          let configs = this.getEventConfigsForTags(currentTags);
          if (this.categoryFilter) {
            configs = configs.filter(
              x =>
                x.name
                  .toLowerCase()
                  .indexOf(this.categoryFilter.toLowerCase()) !== -1 ||
                x.tags.some(
                  x =>
                    x
                      .toLowerCase()
                      .indexOf(this.categoryFilter.toLowerCase()) !== -1
                )
            );
          }
          const filters = configs.map(config => {
            const events: EventDto[] = this.getEventsForEventConfig(config);
            const eventWithAbility = events.find(x => !!x.abilityGuid);
            if (eventWithAbility) {
              const ability: Ability = this.abilities.find(
                x => x.guid === eventWithAbility.abilityGuid
              );
              return new EventConfigFilter(
                config,
                ability ? ability.guid : null,
                ability ? ability.abilityIcon : null,
                events.length,
                this.configs
              );
            }
            return new EventConfigFilter(
              config,
              null,
              null,
              events.length,
              this.configs
            );
          });
          filteredCategories.push(
            new EventConfigCategory(currentTags.length, tag, filters)
          );
          filteredCategories =
            filteredCategories[filteredCategories.length - 1].categories;
        }
      });
    });

    categories = categories.filter(
      x => ['phase', 'title'].indexOf(x.name) === -1
    );

    return categories;
  }

  getTags(): string[][] {
    return this.configs
      .map(config => config.tags)
      .filter((tags, index, array) => {
        const arrayOfJoinedTags = array.map(x => x.join(' '));
        return arrayOfJoinedTags.indexOf(tags.join(' ')) === index;
      })
      .sort();
  }

  getEventConfigsForTags(tags: string[]): EventConfig[] {
    return this.uniqueConfigs
      .filter(config => config.tags.join(' ') === tags.join(' '))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getEventsForEventConfig(config: EventConfig): EventDto[] {
    return this.events.filter(event => {
      const configs = this.getConfigsWithinTheSameFilter(config);
      return (
        event.configId &&
        configs.findIndex(
          x => x.id === event.configId && x.group === event.configGroup
        ) > -1
      );
    });
  }

  private getConfigsWithinTheSameFilter(config: EventConfig): EventConfig[] {
    return this.configs.filter(
      x => x.name === config.name && x.tags.join(' ') === config.tags.join(' ')
    );
  }
}

export class EventConfigDefaultVisbility {
  constructor(
    public name: string,
    public tags: string[],
    public show: boolean
  ) {}
}

export class EventConfigCategory {
  constructor(
    public depth: number,
    public name: string,
    public filters: EventConfigFilter[],
    public categories: EventConfigCategory[] = []
  ) {}

  get hasFilters(): boolean {
    return (
      this.filters.length > 0 ||
      this.categories.some(x => this.categoryHasFilters(x))
    );
  }

  private categoryHasFilters(category: EventConfigCategory): boolean {
    return (
      category.filters.length > 0 ||
      category.categories.some(x => this.categoryHasFilters(x))
    );
  }
}

export class EventConfigFilter {
  constructor(
    public config: EventConfig,
    public abilityId: number,
    public abilityIcon: string,
    public count: number,
    public configs: EventConfig[]
  ) {}
}
