import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {BehaviorSubject, Observable} from "rxjs";
import { Zone } from "./zone";
import { Ranking } from "./ranking";
import { CombatEvent } from "./combat-event";
import { Report } from "./report";

@Injectable()
export class WarcraftLogsService {

  private url = "https://www.warcraftlogs.com/v1/";
  private apiKey = "4755ffa6214768b13beab7deb1bfc85f";

  private zones$: BehaviorSubject<Zone[]> = new BehaviorSubject(null);
  zones: Observable<Zone[]>;

  private rankings$: BehaviorSubject<Ranking[]> = new BehaviorSubject(null);
  rankings: Observable<Ranking[]>;

  private events$: BehaviorSubject<CombatEvent[]> = new BehaviorSubject(null);
  events: Observable<CombatEvent[]>;

  private report$: BehaviorSubject<Report> = new BehaviorSubject(null);
  report: Observable<Report>;

  constructor(private http: Http) {
    this.zones = this.zones$.asObservable();
    this.rankings = this.rankings$.asObservable();
    this.events = this.events$.asObservable();
    this.report = this.report$.asObservable();
  }

  getZones(): Promise<void> {
    return this.http.get(this.url + "zones?api_key=" + this.apiKey, { headers: new Headers() })
      .toPromise()
      .then(res => this.zones$.next(res.json()))
      .catch(this.handleError);
  }

  getRankings(encounterId: number, metric: string, difficulty: number, partition: number, limit: number): Promise<void> {
    return this.http.get(this.url
        + "rankings/encounter/" + encounterId
        + "?api_key=" + this.apiKey
        + "&metric=" + metric
        + "&difficulty=" + difficulty
        + "&partition=" + partition
        + "&limit=" + limit, { headers: new Headers() })
      .toPromise()
      .then(res => this.rankings$.next(res.json().rankings))
      .catch(this.handleError);
  }

  getEvents(reportId: string, start: number, end: number, filter: string): Promise<void> {
    return this.http.get(this.url
      + "report/events/" + reportId
      + "?api_key=" + this.apiKey
      + "&start=" + start
      + "&end=" + end
      + "&filter=" + filter, { headers: new Headers() })
      .toPromise()
      .then(res => this.events$.next(res.json().events))
      .catch(this.handleError);
  }

  getReport(reportId: string): Promise<void> {
    return this.http.get(this.url
      + "report/fights/" + reportId
      + "?api_key=" + this.apiKey, { headers: new Headers() })
      .toPromise()
        .then(res => {
            let report = res.json();
            report.id = reportId;

            this.report$.next(report);
        })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error);

    return Promise.reject(error.message || error);
  }

}
