import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject, Observable } from "rxjs";
import { CombatEvent } from "./combat-event";
import { Parse } from "./parse";
import { Report } from "./report";
import { Router } from "@angular/router";
import { Death } from "app/warcraft-logs/death";
import { WipefestService } from "app/wipefest.service";

@Injectable()
export class WarcraftLogsService {

    private url = "https://www.warcraftlogs.com/v1/";
    private apiKey = "4755ffa6214768b13beab7deb1bfc85f";

    constructor(private http: Http) { }

    getParses(character: string, realm: string, region: string, zone: number): Observable<Parse[]> {
        return this.http.get(this.url
            + "parses/character/" + character
            + "/" + realm
            + "/" + region
            + "?api_key=" + this.apiKey
            + "&zone=" + zone, { headers: new Headers() })
            .map(response => response.json())
            .catch(this.handleError);
    }

    getReport(reportId: string): Observable<Report> {
        return this.http.get(this.url
            + "report/fights/" + reportId
            + "?api_key=" + this.apiKey, { headers: new Headers() })
            .map(response => {
                let report = response.json();
                report.id = reportId;

                return report;
            })
            .catch(this.handleError);
    }

    getCombatEvents(reportId: string, start: number, end: number, filter: string): Observable<CombatEvent[]> {
        return this.http.get(this.url
            + "report/events/" + reportId
            + "?api_key=" + this.apiKey
            + "&start=" + start
            + "&end=" + end
            + "&filter=" + filter, { headers: new Headers() })
            .map(response => response.json().events)
            .catch(this.handleError);
    }

    getDeaths(reportId: string, start: number, end: number): Observable<Death[]> {
        return this.http.get(this.url
            + "report/tables/deaths/" + reportId
            + "?api_key=" + this.apiKey
            + "&start=" + start
            + "&end=" + end, { headers: new Headers() })
            .map(response => response.json().entries)
            .catch(this.handleError);
    }

    private handleError(error: Response | any): Observable<Response> {
        console.error(error);

        return Observable.throw(error);
    }

}
