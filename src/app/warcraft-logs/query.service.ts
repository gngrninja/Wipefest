import { Injectable } from '@angular/core';
import { EventConfigFilter, EventConfig, EventConfigFilterAbility, EventConfigCombinedFilter } from "app/event-config/event-config";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { CombatEvent } from "app/warcraft-logs/combat-event";

@Injectable()
export class QueryService {

    getQuery(eventConfigs: EventConfig[]): string {
        let queries = this.combineFilters(eventConfigs.map(x => x.filter))
            .map(x => x.parse());
        queries.push("type = 'combatantinfo'");
        let query = this.joinQueries(queries);
        console.log(query);

        return query;
    }

    private combineFilters(eventConfigFilters: EventConfigFilter[]): EventConfigCombinedFilter[] {
        let combinedFilters: EventConfigCombinedFilter[] = [];

        eventConfigFilters.filter(x => x != undefined).forEach(filter => {
            if (!filter.types) {
                filter.types = [filter.type];
            }
            if (!filter.stack) {
                filter.stack = 0;
            }

            filter.types.forEach(type => {
                let index = combinedFilters.findIndex(x => x.type == type && x.stack == filter.stack);

                if (index != -1) {
                    combinedFilters[index].filters.push(filter);
                } else {
                    combinedFilters.push(new EventConfigCombinedFilter(type, filter.stack, [filter]));
                }
            });
        });

        return combinedFilters;
    }

    private joinQueries(queries: string[]) {
        return "(" + queries.join(") or (") + ")";
    }
}
