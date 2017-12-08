import { Component, Input } from '@angular/core';
import { EventConfigCategory, EventConfigFilter } from "./fight-summary-filters.component";
import { EventConfig } from "app/event-config/event-config";
import { LoggerService } from "../shared/logger.service";

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
    // TODO: Recursively check this category and subcategories for any filters
    return true;
  }

  constructor(private readonly logger: LoggerService) { }

  getButtonClass(config: EventConfig, count: number) {
    let classes = "filter ";
    if (count > 0) {
      classes += config.show ? "enabled show" : "enabled";
    } else {
      classes += "disabled";
    }

    return classes;
  }

  toggleConfig(config: EventConfig, configs: EventConfig[]) {
    configs
      .filter(x => x.name == config.name &&
        x.tags.join(" ") == config.tags.join(" "))
      .forEach(x => x.show = !x.show);

    this.logger.logToggleFilter(`${config.name} (${config.tags.join(" ")})`, config.show);
  }

}
