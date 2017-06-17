import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { EventConfig } from "app/event-config/event-config";
import { Http, Response } from "@angular/http";
import { CombatEvent } from "app/warcraft-logs/combat-event";

@Injectable()
export class EventConfigService {

    private url = "assets/event-configs/";

    constructor(private http: Http) { }

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

    filterToMatchingCombatEvents(config: EventConfig, combatEvents: CombatEvent[]): CombatEvent[] {
        let matchingCombatEvents: CombatEvent[] = [];
        if (config.filter) {
            matchingCombatEvents = combatEvents.filter(this.getFilterExpression(config));
        }

        return matchingCombatEvents;
    }

    private getFilterExpression(eventConfig: EventConfig): (combatEvent: CombatEvent) => boolean {
        return (combatEvent: CombatEvent) =>
            combatEvent.type == eventConfig.filter.type &&
            combatEvent.ability.guid == eventConfig.filter.ability.id;
    }

    private handleError(error: Response | any): Observable<Response> {
        console.error(error);

        return Observable.throw(error);
    }

}
