import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs/Rx";
import { Report, Fight } from "app/warcraft-logs/report";

@Injectable()
export class WipefestService {

    private selectedReport$ = new BehaviorSubject<Report>(null);
    selectedReport: Observable<Report>;

    private selectedFight$ = new BehaviorSubject<Fight>(null);
    selectedFight: Observable<Fight>;

    constructor() {
        this.selectedReport = this.selectedReport$.asObservable();
        this.selectedFight = this.selectedFight$.asObservable();
    }

    selectReport(report: Report) {
        this.selectedReport$.next(report);
    }

    selectFight(fight: Fight) {
        this.selectedFight$.next(fight);
    }

}
