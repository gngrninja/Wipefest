import { Injectable } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";
import { BehaviorSubject, Observable } from "rxjs";
import { CombatEvent } from "./combat-event";
import { Parse } from "./parse";
import { Report } from "./report";
import { Router } from "@angular/router";
import { Death } from "app/warcraft-logs/death";
import { WipefestService } from "app/wipefest.service";
import { GuildReport } from "app/warcraft-logs/guild-report";
import { environment } from "environments/environment";
import { LoggerService } from "app/shared/logger.service";
import { ClassesService } from "app/warcraft-logs/classes.service";

@Injectable()
export class WarcraftLogsService {

    private url = "https://www.warcraftlogs.com/v1/";
    private apiKey = "4755ffa6214768b13beab7deb1bfc85f";

    constructor(
        private http: Http,
        private classesService: ClassesService,
        private logger: LoggerService) { }

    private get(url: string): Observable<Response> {
        this.logger.logGetRequest(url);
        return this.http.get(url, { headers: new Headers() });
    }

    getParses(character: string, realm: string, region: string, zone: number, partitions: number[]): Observable<Parse[]> {
        let batch = partitions.map(x => this.getParsesForPartition(character, realm, region, zone, Metric.Damage, x));

        return Observable.forkJoin(batch)
            .map(x => [].concat.apply([], x)); // Flatten arrays into one array
    }

    private getParsesForPartition(character: string, realm: string, region: string, zone: number, metric: Metric, partition: number): Observable<Parse[]> {
        let damageParses = this.getParsesForMetric(character, realm, region, zone, Metric.Damage, partition);
        let healingParses = this.getParsesForMetric(character, realm, region, zone, Metric.Healing, partition);

        let batch = [damageParses, healingParses];

        return Observable.forkJoin(batch)
            .map(x => [].concat.apply([], x)); // Flatten arrays into one array
    }

    private getParsesForMetric(character: string, realm: string, region: string, zone: number, metric: Metric, partition: number): Observable<Parse[]> {
        return this.get(this.url
            + "parses/character/" + character
            + "/" + realm
            + "/" + region
            + "?api_key=" + this.apiKey
            + "&zone=" + zone
            + "&metric=" + (metric == Metric.Damage ? "dps" : "hps")
            + "&partition=" + partition)
            .catch(error => this.handleError(error))
            .map(response => (<Parse[]>response.json()).map(x => {
                let difficulty = x;
                difficulty.specs = difficulty.specs.filter(y => {
                    let spec = this.classesService.getSpecializationByName(y.class, y.spec);
                    if (!spec) return false;

                    if (metric == Metric.Damage && spec.role != "Healer") return true;
                    if (metric == Metric.Healing && spec.role == "Healer") return true;
                    return false;
                });
                return difficulty;
            }));
    }

    getGuildReports(guild: string, realm: string, region: string, start: number, end: number): Observable<GuildReport[]> {
        return this.get(this.url
            + "reports/guild/" + guild
            + "/" + realm
            + "/" + region
            + "?api_key=" + this.apiKey
            + "&start=" + start
            + "&end=" + end
            + "&random=" + this.getRandomString())
            .map(response => response.json())
            .catch(error => this.handleError(error));
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

    getCombatEvents(reportId: string, start: number, end: number, filter: string): Observable<CombatEvent[]> {
        return this.getPageOfCombatEvents(reportId, start, end, filter)
            .expand(page => {
                if (!page.nextPageTimestamp) {
                    return Observable.empty();
                }

                return this.getPageOfCombatEvents(reportId, page.nextPageTimestamp, end, filter, page);
            })
            .map(x => x.events);
    }

    private getPageOfCombatEvents(reportId: string, start: number, end: number, filter: string, previousPage: CombatEventPage = null): Observable<CombatEventPage> {
        return this.get(this.url
            + "report/events/" + reportId
            + "?api_key=" + this.apiKey
            + "&start=" + start
            + "&end=" + end
            + "&filter=" + filter)
            .map(response => {
                let page = response.json();
                if (!previousPage) {
                    return page;
                }
                return new CombatEventPage(previousPage.events.concat(page.events), page.nextPageTimestamp);
            })
            .catch(error => this.handleError(error));
    }

    getDeaths(reportId: string, start: number, end: number): Observable<Death[]> {
        return this.get(this.url
            + "report/tables/deaths/" + reportId
            + "?api_key=" + this.apiKey
            + "&start=" + start
            + "&end=" + end)
            .map(response => response.json().entries)
            .catch(error => this.handleError(error));
    }

    getEncounters(): Encounter[] {
        return [
            new Encounter(2032, "Goroth"),
            new Encounter(2048, "Demonic Inquisition"),
            new Encounter(2036, "Harjatan"),
            new Encounter(2037, "Mistress Sassz'ine"),
            new Encounter(2050, "Sisters of the Moon"),
            new Encounter(2054, "The Desolate Host"),
            new Encounter(2052, "Maiden of Vigilance"),
            new Encounter(2038, "Fallen Avatar"),
            new Encounter(2051, "Kil'jaeden"),
            new Encounter(2076, "Garothi Worldbreaker"),
            new Encounter(2074, "Felhounds of Sargeras"),
            new Encounter(2070, "Antoran High Command"),
            new Encounter(2075, "Eonar the Life-Binder"),
            new Encounter(2064, "Portal Keeper Hasabel"),
            new Encounter(2082, "Imonar the Soulhunter"),
            new Encounter(2088, "Kin'garoth"),
            new Encounter(2069, "Varimathras"),
            new Encounter(2073, "The Coven of Shivarra"),
            new Encounter(2063, "Aggramar"),
            new Encounter(2092, "Argus the Unmaker"),
        ];
    }

    getEncounter(id: number): Encounter {
        return this.getEncounters().find(x => x.id == id);
    }

    private handleError(error: Response | any): Observable<Response> {
        this.logger.logErrorResponse(error);

        if (!environment.production) {
            console.error(error);
        }

        return Observable.throw(error);
    }

    private getRandomString() {
        let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let output = "";
        for (let i = 0; i < 12; i++) {
            output += characters[this.getRandomNumber(characters.length)];
        }
        return output;
    }

    private getRandomNumber(max: number) {
        return Math.floor(Math.random() * (max + 0.999999));
    }

}

export class CombatEventPage {
    constructor(
        public events: CombatEvent[],
        public nextPageTimestamp: number) { }
}

export class Encounter {

    constructor(public id: number, public name: string) { }

}

export enum Metric {
    Damage, Healing
}
