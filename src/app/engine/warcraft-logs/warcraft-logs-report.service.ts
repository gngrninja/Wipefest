import { Observable } from "rxjs/Observable";
import { Report } from "app/engine/reports/report";
import { IReportService } from "app/engine/reports/report-service";
import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class WarcraftLogsReportService implements IReportService {

    constructor(private http: Http, private url: string, private apiKey: string) { }

    private get(url: string): Observable<Response> {
        return this.http.get(url, { headers: new Headers() });
    }

    getReport(reportId: string): Observable<Report> {
        return this.get(this.url
            + "report/fights/" + reportId
            + "?api_key=" + this.apiKey
            + "&random=" + this.getRandomString())
            .map(response => {
                let report = response.json();
                report.id = reportId;

                return report;
            })
            .catch(error => this.handleError(error));
    }

    private handleError(error: Response | any): Observable<Response> {
        return Observable.throw(error);
    }

    private getRandomString() {
        let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let output = "";
        for (let i = 0; i < 12; i++) {
            output += characters[this.getRandomNumber(characters.length) - 1];
        }
        return output;
    }

    private getRandomNumber(max: number) {
        return Math.floor(Math.random() * (max + 0.999999));
    }

}
