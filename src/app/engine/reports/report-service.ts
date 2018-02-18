import { Report } from "app/engine/reports/report";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

@Injectable()
export interface IReportService {

    getReport(reportId: string): Observable<Report>;

}

