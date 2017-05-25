import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject, Observable } from "rxjs";
import { CombatEvent } from "./combat-event";
import { Report } from "./report";
import { Router } from "@angular/router";

@Injectable()
export class WarcraftLogsService {

    private url = "https://www.warcraftlogs.com/v1/";
    private apiKey = "4755ffa6214768b13beab7deb1bfc85f";

    constructor(private http: Http) { }

    getEvents(reportId: string, start: number, end: number, filter: string): Observable<CombatEvent[]> {
        return this.http.get(this.url
            + "report/events/" + reportId
            + "?api_key=" + this.apiKey
            + "&start=" + start
            + "&end=" + end
            + "&filter=" + filter, { headers: new Headers() })
            .map(response => response.json().events)
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

    private handleError(error: any): Promise<any> {
        console.error("An error occurred", error);

        return Promise.reject(error.message || error);
    }

}
