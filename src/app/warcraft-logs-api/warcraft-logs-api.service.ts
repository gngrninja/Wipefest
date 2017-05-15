import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {BehaviorSubject, Observable} from "rxjs";
import { Zone } from "./zone";
import { Ranking } from "./ranking";
import { CombatEvent } from "./combat-event";

@Injectable()
export class WarcraftLogsApiService {

  private url = "https://www.warcraftlogs.com/v1/";
  private apiKey = "4755ffa6214768b13beab7deb1bfc85f";

  private zones$: BehaviorSubject<Zone[]> = new BehaviorSubject(null);
  zones: Observable<Zone[]>;

  private rankings$: BehaviorSubject<Ranking[]> = new BehaviorSubject(null);
  rankings: Observable<Ranking[]>;

  private events$: BehaviorSubject<CombatEvent[]> = new BehaviorSubject(null);
  events: Observable<CombatEvent[]>;

  constructor(private http: Http) {
    this.zones = this.zones$.asObservable();
    this.rankings = this.rankings$.asObservable();
    this.events = this.events$.asObservable();

    this.getZones();
  }

  private getZones(): Promise<void> {
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

    // https://www.warcraftlogs.com/v1/rankings/encounter/1866?metric=execution&difficulty=5&limit=200&api_key=4755ffa6214768b13beab7deb1bfc85f
  }

  getEvents(reportId: string, start: number, end: number, filter: string) {
    return this.http.get(this.url
      + "report/events/" + reportId
      + "?api_key=" + this.apiKey
      + "&start=" + start
      + "&end=" + end
      + "&filter=" + filter, { headers: new Headers() })
      .toPromise()
      .then(res => this.events$.next(res.json().events))
      .catch(this.handleError);

    // https://www.warcraftlogs.com/v1/report/events/ZQqdW2G8hXDfntvT?start=0&end=910752&filter=ability.id%20in%20%2831821%2C62618%2C98008%2C97462%2C64843%2C108280%2C740%2C115310%2C15286%2C196718%29&api_key=4755ffa6214768b13beab7deb1bfc85f
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error);

    return Promise.reject(error.message || error);
  }

}
