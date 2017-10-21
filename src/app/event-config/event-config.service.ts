import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { EventConfig, EventConfigIndex } from "app/event-config/event-config";
import { Http, Response } from "@angular/http";
import { CombatEvent } from "app/warcraft-logs/combat-event";
import { Report } from "app/warcraft-logs/report";
import { environment } from "environments/environment";
import { LoggerService } from "app/shared/logger.service";

@Injectable()
export class EventConfigService {

    constructor(private http: Http, private logger: LoggerService) { }
    
    getEventConfigs(includes: string[], eventConfigBranch: string): Observable<EventConfig[]> {
        let url = environment.eventConfigsUrl;
        if (eventConfigBranch) {
            url = url.replace("master", eventConfigBranch);
        }

        let batch: Observable<EventConfig[]>[] = [];

        includes.forEach(include => {
            let observable = this.http.get(url + include + ".json")
                .map(response => response.json())
                .catch(error => this.handleError(error));

            batch.push(observable);
        });

        return Observable.forkJoin(batch)
            .map(x => [].concat.apply([], x)); // Flatten arrays into one array
    }

    getIncludes(bossId: number, eventConfigBranch: string): Observable<string[]> {
        let url = environment.eventConfigsUrl;
        if (eventConfigBranch) {
            url = url.replace("master", eventConfigBranch);
        }

        return this.getEventConfigIndex(url).map(x => x.find(boss => boss.id == bossId).includes);
    }

    private getEventConfigIndex(url: string): Observable<EventConfigIndex[]> {
        return this.http.get(url + "index.json")
            .map(response => response.json())
            .catch(error => this.handleError(error));
    }

    filterToMatchingCombatEvents(config: EventConfig, combatEvents: CombatEvent[], report: Report): CombatEvent[] {
        let matchingCombatEvents: CombatEvent[] = [];
        if (config.filter) {
            matchingCombatEvents = combatEvents.filter(this.getFilterExpression(config, report));
            
            if (config.filter.first && matchingCombatEvents.length > 0) {
                matchingCombatEvents = [matchingCombatEvents[0]];
            }
            if (config.filter.firstPerInstance || config.filter.type == "firstseen") {
                matchingCombatEvents = matchingCombatEvents.filter((x, index, array) => array.findIndex(y => y.sourceInstance == x.sourceInstance) == index);
            }
            if (config.filter.stack) {
                matchingCombatEvents = matchingCombatEvents.filter(x => x.stack == config.filter.stack);
            }

            if (config.filter.range && matchingCombatEvents.length > 0) {
                matchingCombatEvents = this.filterToRange(config, matchingCombatEvents, config.filter.range, config.filter.minimum);
            }
        }

        return matchingCombatEvents;
    }

    private filterToRange(config: EventConfig, combatEvents: CombatEvent[], range: number, minimum: number): CombatEvent[] {
        combatEvents = combatEvents.sort((a, b) => a.timestamp - b.timestamp);
        let start = combatEvents[0].timestamp;
        let end = combatEvents[combatEvents.length - 1].timestamp;

        let matchingCombatEventsOnePerRange: CombatEvent[] = [];
        while (start <= end) {
            let eventsInRange = combatEvents.filter(x => x.timestamp >= start && x.timestamp <= (start + range));
            if ((minimum && eventsInRange.length < minimum) || eventsInRange.length == 0) {
                start += 500;
                continue;
            }

            if (config.eventType == "damage") {
                // Sum all damage into first matching damage event and use that
                let totalEvent = eventsInRange.reduce((x, y) => {
                    x.amount += y.amount;
                    x.absorbed += y.absorbed;
                    x.overkill += y.overkill;
                    return x;
                });
                matchingCombatEventsOnePerRange.push(totalEvent);
            } else {
                matchingCombatEventsOnePerRange.push(combatEvents.find(x => x.timestamp >= start));
            }

            start = matchingCombatEventsOnePerRange[matchingCombatEventsOnePerRange.length - 1].timestamp;
            start += range;
        }
        combatEvents = matchingCombatEventsOnePerRange;

        return combatEvents;
    }

    private getFilterExpression(config: EventConfig, report: Report): (combatEvent: CombatEvent, index: number, array: CombatEvent[]) => boolean {
        if (config.filter.type == "firstseen") {
            let actor = report.enemies.find(x => x.guid == config.filter.actor.id);
            return (combatEvent: CombatEvent) =>
                combatEvent.sourceID == actor.id ||
                combatEvent.targetID == actor.id;
        }

        if (config.filter.type == "percent") {
            let actor = report.enemies.find(x => x.guid == config.filter.actor.id);
            return (combatEvent: CombatEvent) =>
                (combatEvent.type == "cast" || combatEvent.type == "applybuff" || combatEvent.type == "applydebuff") &&
                combatEvent.sourceID == actor.id;
        }

        if (!config.filter.types) {
            config.filter.types = [config.filter.type];
        }

        if (config.filter.ability.ids) {
            return (combatEvent: CombatEvent) =>
                config.filter.types.indexOf(combatEvent.type) != -1 &&
                config.filter.ability.ids.indexOf(combatEvent.ability.guid) != -1;
        }

        return (combatEvent: CombatEvent) =>
            config.filter.types.indexOf(combatEvent.type) != -1 &&
            combatEvent.ability.guid == config.filter.ability.id;
    }

    private handleError(error: Response | any): Observable<Response> {
        this.logger.logErrorResponse(error);

        if (!environment.production) {
            console.error(error);
        }

        return Observable.throw(error);
    }

}
