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
        let query = this.joinQueries(queries);

        return query;
    }

    private combineFilters(eventConfigFilters: EventConfigFilter[]): EventConfigCombinedFilter[] {
        let combinedFilters = [];

        eventConfigFilters.filter(x => x != undefined).forEach(filter => {
            let index = combinedFilters.findIndex(x => x.type == filter.type);
            if (index != -1) {
                combinedFilters[index].abilities.push(filter.ability);
            } else {
                combinedFilters.push(new EventConfigCombinedFilter(filter.type, [filter.ability]));
            }
        });

        return combinedFilters;
    }

    private joinQueries(queries: string[]) {
        return "(" + queries.join(") or (") + ")";
    }
}
