import { Injectable } from "@angular/core";
import { Death } from "app/engine/deaths/death";
import { Observable } from "rxjs/Observable";
import { Http, Headers, Response } from "@angular/http";
import { IDeathService } from "app/engine/deaths/death.service";
import { FightInfo, Report } from "app/engine/reports/report";

@Injectable()
export class WarcraftLogsDeathService implements IDeathService {

    constructor(private http: Http, private url: string, private apiKey: string) { }

    private get(url: string): Observable<Response> {
        return this.http.get(url, { headers: new Headers() });
    }

    getDeaths(report: Report, fight: FightInfo): Observable<Death[]> {
        return this.get(this.url
            + "report/tables/deaths/" + report.id
            + "?api_key=" + this.apiKey
            + "&start=" + fight.start_time
            + "&end=" + fight.end_time)
            .map(response => response.json().entries)
            .catch(error => this.handleError(error));
    }

    private handleError(error: Response | any): Observable<Response> {
        return Observable.throw(error);
    }

}
