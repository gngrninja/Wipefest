import { Injectable } from '@angular/core';
import { Report, Fight } from "app/warcraft-logs/report";
import { Observable, BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class WipefestService {

    private selectedReport$: BehaviorSubject<Report> = new BehaviorSubject(null);
    selectedReport: Observable<Report>;

    private selectedFight$: BehaviorSubject<Fight> = new BehaviorSubject(null);
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
