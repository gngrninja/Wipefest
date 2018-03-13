import { Report } from "app/engine/reports/report";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

export interface IReportService {

    getReport(reportId: string): Observable<Report>;

}

