import { Observable } from "rxjs/Observable";
import { Report, FightInfo } from "app/engine/reports/report";
import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { ICombatEventService } from "app/engine/combat-events/combat-event-service";
import { CombatEvent } from "app/engine/combat-events/combat-event";
import { EventConfig } from "app/event-config/event-config";
import { EventConfigService } from "app/engine/event-configs/event-config-service";

@Injectable()
export class WarcraftLogsCombatEventService implements ICombatEventService {

    constructor(private eventConfigService: EventConfigService, private http: Http, private url: string, private apiKey: string) { }

    private get(url: string): Observable<Response> {
        return this.http.get(url, { headers: new Headers() });
    }

    getCombatEvents(report: Report, fight: FightInfo, eventConfigs: EventConfig[]): Observable<CombatEvent[]> {
        var query = this.getQuery(eventConfigs);
        return this.getPageOfCombatEvents(report, fight, query)
            .expand(page => {
                if (!page.nextPageTimestamp) {
                    return Observable.empty();
                }

                return this.getPageOfCombatEvents(report, fight, query, page);
            })
            .map(x => x.events);
    }

    private getPageOfCombatEvents(report: Report, fight: FightInfo, query: string, previousPage: CombatEventPage = null): Observable<CombatEventPage> {
        return this.get(this.url
            + "report/events/" + report.id
            + "?api_key=" + this.apiKey
            + "&start=" + fight.start_time
            + "&end=" + fight.end_time
            + "&filter=" + query)
            .map(response => {
                let page = response.json();
                if (!previousPage) {
                    return page;
                }
                return new CombatEventPage(previousPage.events.concat(page.events), page.nextPageTimestamp);
            })
            .catch(error => this.handleError(error));
    }

    private getQuery(eventConfigs: EventConfig[]): string {
        let queries = this.eventConfigService.combineFilters(eventConfigs.map(x => x.filter))
            .map(x => x.parse());
        queries.push("type = 'combatantinfo'");
        let query = this.joinQueries(queries);

        return query;
    }

    private joinQueries(queries: string[]) {
        return "(" + queries.join(") or (") + ")";
    }
    
    private handleError(error: Response | any): Observable<Response> {
        return Observable.throw(error);
    }

}

export class CombatEventPage {
    constructor(
        public events: CombatEvent[],
        public nextPageTimestamp: number) { }
}