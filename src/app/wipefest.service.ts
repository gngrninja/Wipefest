import { Injectable } from '@angular/core';
import { Response } from "@angular/http";
import { BehaviorSubject, Observable } from "rxjs/Rx";
import { Report, Fight } from "app/warcraft-logs/report";

@Injectable()
export class WipefestService {

    private selectedPage$ = new BehaviorSubject<Page>(Page.None);
    selectedPage: Observable<Page>;

    private selectedReport$ = new BehaviorSubject<Report>(null);
    selectedReport: Observable<Report>;

    private selectedFight$ = new BehaviorSubject<Fight>(null);
    selectedFight: Observable<Fight>;

    private errors: Response[] = [];

    constructor() {
        this.selectedPage = this.selectedPage$.asObservable();
        this.selectedReport = this.selectedReport$.asObservable();
        this.selectedFight = this.selectedFight$.asObservable();
    }

    selectPage(page: Page) {
        this.selectedPage$.next(page);
    }

    selectReport(report: Report) {
        this.selectedReport$.next(report);
    }

    selectFight(fight: Fight) {
        this.selectedFight$.next(fight);
    }

    throwError(error: Response) {
        this.errors.push(error);
    }

    getLastError(): Response {
        if (this.errors.length == 0) {
            return null;
        }

        return this.errors[this.errors.length - 1];
    }

}

export enum Page {

    None, Welcome, CharacterSearchResults, GuildSearchResults, ReportSummary, FightSummary

}
