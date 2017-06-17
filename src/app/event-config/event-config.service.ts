import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { EventConfig, EventConfigIndex } from "app/event-config/event-config";
import { Http, Response } from "@angular/http";
import { CombatEvent } from "app/warcraft-logs/combat-event";
import { Report } from "app/warcraft-logs/report";

@Injectable()
export class EventConfigService {

    private url = "assets/event-configs/";

    constructor(private http: Http) { }

    getEventConfigs(includes: string[]): Observable<EventConfig[]> {
        let batch: Observable<EventConfig[]>[] = [];

        includes.forEach(include => {
            let observable = this.http.get(this.url + include + ".json")
                .map(response => response.json())
                .catch(this.handleError);

            batch.push(observable);
        });

        return Observable.forkJoin(batch)
            .map(x => [].concat.apply([], x)); // Flatten arrays into one array
    }

    getIncludes(bossId: number): Observable<string[]> {
        return this.getEventConfigIndex().map(x => x.find(boss => boss.id == bossId).includes);
    }

    private getEventConfigIndex(): Observable<EventConfigIndex[]> {
        return this.http.get(this.url + "index.json")
            .map(response => response.json())
            .catch(this.handleError);
    }

    filterToMatchingCombatEvents(config: EventConfig, combatEvents: CombatEvent[], report: Report): CombatEvent[] {
        let matchingCombatEvents: CombatEvent[] = [];
        if (config.filter) {
            matchingCombatEvents = combatEvents.filter(this.getFilterExpression(config, report));
        }

        return matchingCombatEvents;
    }

    private getFilterExpression(eventConfig: EventConfig, report: Report): (combatEvent: CombatEvent) => boolean {
        if (eventConfig.filter.type == "firstseen") {
            let actor = report.enemies.find(x => x.name == eventConfig.filter.actor.name);
            return (combatEvent: CombatEvent) =>
                combatEvent.sourceID == actor.id ||
                combatEvent.targetID == actor.id;
        }

        if (eventConfig.filter.ability.ids) {
            return (combatEvent: CombatEvent) =>
                combatEvent.type == eventConfig.filter.type &&
                eventConfig.filter.ability.ids.indexOf(combatEvent.ability.guid) != -1;
        }

        return (combatEvent: CombatEvent) =>
            combatEvent.type == eventConfig.filter.type &&
            combatEvent.ability.guid == eventConfig.filter.ability.id;
    }

    private handleError(error: Response | any): Observable<Response> {
        console.error(error);

        return Observable.throw(error);
    }

}
