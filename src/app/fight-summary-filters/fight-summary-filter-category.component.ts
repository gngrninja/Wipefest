import { Component, Input } from '@angular/core';
import { StateService } from 'app/shared/state.service';
import { LoggerService } from '../shared/logger.service';
import {
  EventConfigCategory,
  EventConfigFilter
} from './fight-summary-filters.component';
import { EventConfig, Ability } from '@wipefest/api-sdk/dist/lib/models';

@Component({
  selector: 'fight-summary-filter-category',
  templateUrl: './fight-summary-filter-category.component.html',
  styleUrls: ['./fight-summary-filter-category.component.scss']
})
export class FightSummaryFilterCategoryComponent {
  @Input() depth: number;
  @Input() name: string;
  @Input() filters: EventConfigFilter[];
  @Input() categories: EventConfigCategory[];

  get hasFilters(): boolean {
    return this.filters.length > 0 || this.categories.some(x => x.hasFilters);
  }

  constructor(
    private stateService: StateService,
    private readonly logger: LoggerService
  ) {}

  getButtonClass(config: EventConfig, count: number): string {
    let classes = 'filter ';
    if (count > 0) {
      classes += config.show ? 'enabled show' : 'enabled';
    } else {
      classes += 'disabled';
    }

    return classes;
  }

  toggleConfig(config: EventConfig, configs: EventConfig[]): void {
    configs
      .filter(
        x =>
          x.name === config.name && x.tags.join(' ') === config.tags.join(' ')
      )
      .forEach(x => {
        x.show = !x.show;
      });

    this.stateService.selectFiltersFromConfigs(configs);
    this.logger.logToggleFilter(
      `${config.name} (${config.tags.join(' ')})`,
      config.show
    );
  }
}
