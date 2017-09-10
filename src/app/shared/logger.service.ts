import { Injectable } from '@angular/core';
import { Angulartics2 } from "angulartics2/dist";
import { Response } from "@angular/http";
import * as StackTrace from 'stacktrace-js';
import { Router } from "@angular/router";

@Injectable()
export class LoggerService {

    constructor(private router: Router, private angulartics2: Angulartics2) { }

    private log(log: Log) {
        let analytic: any = {};
        analytic.action = log.action;
        analytic.properties = { category: log.category };
        if (log.label) {
            analytic.properties.label = log.label;
        }
        if (log.value) {
            analytic.properties.value = log.value;
        }

        this.angulartics2.eventTrack.next(analytic);
    }

    private error(errorLog: ErrorLog) {
        this.angulartics2.exceptionTrack.next(errorLog);
    }

    logError(error) {
        const message = error.message ? error.message : error.toString();
        StackTrace.fromError(error).then(stackframes => {
            const stackTrace = stackframes
                .splice(0, 20)
                .map(function (sf) {
                    return sf.toString();
                }).join('\r\n');

            this.error(new ErrorLog(`Url: ${this.router.url}, Message: ${message}, Stack trace: ${stackTrace}`, true))
        });
    }

    logErrorResponse(error: Response) {
        this.error(new ErrorLog(`Url: ${error.url}, Status: ${error.status}, Message: ${error.json().error}`, false));
    }

    logNotFound() {
        this.error(new ErrorLog(`Url: ${this.router.url}, Message: Not found`, false));
    }

    logGetRequest(url: string) {
        this.log(new Log("HTTP", "GET", url));
    }

    logCharacterFavourite(isSet: boolean, character: string, realm: string, region: string) {
        this.log(new Log("Favourite", isSet ? "Save character" : "Clear character", `Character: ${character}, Realm: ${realm}, Region: ${region}`));
    }

    logGuildFavourite(isSet: boolean, guild: string, realm: string, region: string) {
        this.log(new Log("Favourite", isSet ? "Save guild" : "Clear guild", `Guild: ${guild}, Realm: ${realm}, Region: ${region}`));
    }

    logCharacterSearch(character: string, realm: string, region: string) {
        this.log(new Log("Search", "Character", `Character: ${character}, Realm: ${realm}, Region: ${region}`));
    }

    logGuildSearch(guild: string, realm: string, region: string) {
        this.log(new Log("Search", "Guild", `Guild: ${guild}, Realm: ${realm}, Region: ${region}`));
    }

    logLinkSearch(warcraftLogsLink: string, wipefestLink: string) {
        this.log(new Log("Search", "Link", `Warcraft Logs link: ${warcraftLogsLink}, Wipefest link: ${wipefestLink}`));
    }

    logToggleDesktopFilterMenu(shown: boolean) {
        this.log(new Log("Fight Summary", shown ? "Show desktop filters" : "Hide desktop filters"));
    }

    logToggleDesktopRaidMenu(shown: boolean) {
        this.log(new Log("Fight Summary", shown ? "Show desktop raid" : "Hide desktop raid"));
    }

    logToggleMobileFilterMenu(shown: boolean) {
        this.log(new Log("Fight Summary", shown ? "Show mobile filters" : "Hide mobile filters"));
    }

    logToggleMobileRaidMenu(shown: boolean) {
        this.log(new Log("Fight Summary", shown ? "Show mobile raid" : "Hide mobile raid"));
    }

    logToggleMobileNavigation(shown: boolean) {
        this.log(new Log("Mobile Menu", shown ? "Show navigation" : "Hide navigation"));
    }

    logToggleFilter(filter: string, enabled: boolean) {
        this.log(new Log("Fight Summary", enabled ? "Enable filter" : "Disable filter", filter));
    }

    logShowAllFilters() {
        this.log(new Log("Fight Summary", "Show all filters"));
    }

    logHideAllFilters() {
        this.log(new Log("Fight Summary", "Hide all filters"));
    }

    logResetFilters() {
        this.log(new Log("Fight Summary", "Reset filters"));
    }

    logTogglePhase(difficulty: string, encounter: string, phase: string, shown: boolean) {
        this.log(new Log("Fight Summary", shown ? "Show phase" : "Hide phase", `Difficulty: ${difficulty}, Encounter: ${encounter}, Phase: ${phase}`));
    }

    logSurveyClick() {
        this.log(new Log("Survey", "Click"));
    }

    logDiscordClick() {
        this.log(new Log("Discord", "Click"));
    }

    logDiscordBotClick() {
        this.log(new Log("Discord Bot", "Click"));
    }

    logPatreonClick() {
        this.log(new Log("Patreon", "Click"));
    }

}

export class Log {

    constructor(
        public category: string,
        public action: string,
        public label?: string,
        public value?: number) { }

}

export class ErrorLog {

    constructor(
        public description: string,
        public fatal: boolean) { }

}
