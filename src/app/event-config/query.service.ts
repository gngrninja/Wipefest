import { Injectable } from '@angular/core';
import { EventConfigFilter, EventConfig, EventConfigFilterAbility, EventConfigCombinedFilter } from "app/event-config/event-config";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";

@Injectable()
export class QueryService {

    private url = "assets/event-configs/";

    constructor(private http: Http) { }

    getQuery(eventConfigIds: string[]): Observable<string> {
        return this.getEventConfigs(eventConfigIds).map(eventConfigs => {
            let queries = this.combineFilters(eventConfigs.map(x => x.filter))
                              .map(x => x.parse());
            let query = this.joinQueries(queries);

            return query;
        }).catch(this.handleError);
    }

    private getEventConfigs(ids: string[]): Observable<EventConfig[]> {
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

    private combineFilters(eventConfigFilters: EventConfigFilter[]): EventConfigCombinedFilter[] {
        let combinedFilters = [];

        eventConfigFilters.forEach(filter => {
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
