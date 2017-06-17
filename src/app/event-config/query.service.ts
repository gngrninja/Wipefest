import { Injectable } from '@angular/core';
import { EventConfigFilter, EventConfig, EventConfigFilterAbility, EventConfigCombinedFilter } from "app/event-config/event-config";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { CombatEvent } from "app/warcraft-logs/combat-event";

@Injectable()
export class QueryService {

    private url = "assets/event-configs/";

    constructor(private http: Http) { }

    getQuery(eventConfigs: EventConfig[]): string {
        let queries = this.combineFilters(eventConfigs.map(x => x.filter))
            .map(x => x.parse());
        let query = this.joinQueries(queries);

        return query;
    }

    getEventConfigs(ids: string[]): Observable<EventConfig[]> {
        let batch: Observable<EventConfig[]>[] = [];

        ids.forEach(id => {
            let observable = this.http.get(this.url + id + ".json")
                .map(response => response.json())
                .catch(this.handleError);

            batch.push(observable);
        });

        return Observable.forkJoin(batch)
            .map(x => [].concat.apply([], x)); // Flatten arrays into one array
    }

    getFilterExpression(eventConfig: EventConfig): (combatEvent: CombatEvent) => boolean {
        return (combatEvent: CombatEvent) =>
            combatEvent.type == eventConfig.filter.type &&
            combatEvent.ability.guid == eventConfig.filter.ability.id;
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

    private handleError(error: Response | any): Observable<Response> {
        console.error(error);

        return Observable.throw(error);
    }

}
