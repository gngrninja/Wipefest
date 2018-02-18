import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { environment } from "environments/environment";
import { Observable } from "rxjs/Rx";
import { EventConfig } from "app/event-config/event-config";
import { PhaseChangeEvent } from "app/fight-events/models/phase-change-event";
import { FightEvent } from "app/fight-events/models/fight-event";
import { WipefestService } from "app/wipefest.service";
import { Report } from "app/warcraft-logs/report";

@Injectable()
export class StateService {

    queryParams: any;
    private report: Report;
    private availableFocuses: SelectedFocus[] = [];

    constructor(
        private wipefestService: WipefestService,
        private route: ActivatedRoute,
        private router: Router) {

        this.route.queryParams.subscribe(queryParams => {
            this.queryParams = {};
            this.queryParams.ignore = queryParams.hasOwnProperty("ignore") ? queryParams["ignore"] : undefined;
            this.queryParams.deathThreshold = queryParams.hasOwnProperty("deathThreshold") ? Math.max(1, Math.min(<number>queryParams["deathThreshold"], 99)) : undefined;
            this.queryParams.insights = queryParams.hasOwnProperty("insights") ? queryParams.insights : undefined;
            this.queryParams.filters = queryParams.hasOwnProperty("filters") ? queryParams.filters : undefined;
            this.queryParams.phases = queryParams.hasOwnProperty("phases") ? queryParams.phases : undefined;
            this.queryParams.focuses = queryParams.hasOwnProperty("focuses") ? queryParams.focuses : undefined;

            this.queryParams = this.clean(this.queryParams);

            if (!environment.production) {
                console.log(this);
            }
        });

        this.wipefestService.selectedReport.subscribe(report => this.report = report);

        this.wipefestService.selectedRaid.subscribe(raid => {
            this.availableFocuses = raid ? raid.players.map(player => {
                let friendly = this.report.friendlies.find(friendly => friendly.name == player.name);
                return new SelectedFocus(friendly.id.toString(), [player.specialization.include, player.specialization.generalInclude]);
            }) : [];
        });
    }

    get changes(): Observable<Params> {
        return Observable.merge(this.route.queryParams, this.wipefestService.selectedRaid);
    }

    private updateQueryParams() {
        this.queryParams = this.clean(this.queryParams);
        this.router.navigate([this.router.url.split('?')[0]], { queryParams: this.queryParams, replaceUrl: true });
    }

    private clean(obj) {
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }

        return obj;
    }

    get ignore(): boolean {
        return this.queryParams.ignore == "true";
    }

    set ignore(value: boolean) {
        this.queryParams.ignore = value;
        this.updateQueryParams();
    }

    get deathThreshold(): number {
        return this.queryParams.deathThreshold;
    }

    set deathThreshold(value: number) {
        this.queryParams.deathThreshold = value;
        this.updateQueryParams();
    }

    get insights(): SelectedInsight[] {
        let insightParams: SelectedInsight[] = [];

        if (this.queryParams.insights == undefined)
            return insightParams;

        try {
            this.queryParams.insights.split(",").forEach(bossAndInsights => {
                let split = bossAndInsights.split("-");
                let boss = <number>split[0];
                split[1].split("").forEach(id => insightParams.push(new SelectedInsight(id, boss)));
            });
        } catch (error) {
            return insightParams;
        }

        return insightParams;
    }

    set insights(value: SelectedInsight[]) {
        let insightsPerBoss: SelectedInsight[][] = [];
        value.forEach(x => {
            let insight = new SelectedInsight(x.id, x.boss);
            let existingIndex = insightsPerBoss.findIndex(y => y.some(z => z.boss == x.boss));
            if (existingIndex === -1) {
                insightsPerBoss.push([insight]);
            } else {
                insightsPerBoss[existingIndex].push(insight);
            }
        });

        let insightQueryString = insightsPerBoss.map(x => `${x[0].boss}-${x.map(y => y.id).join("")}`).join(",");

        this.queryParams.insights = insightQueryString == "" ? undefined : insightQueryString;

        this.updateQueryParams();
    }

    isInsightSelected(id: string, boss: number): boolean {
        return this.insights.some(x => x.id == id && x.boss == boss);
    }

    selectInsight(id: string, boss: number) {
        if (!this.isInsightSelected(id, boss)) {
            let selectedInsights = this.insights;
            selectedInsights.push(new SelectedInsight(id, boss))

            this.insights = selectedInsights;
        }
    }

    deselectInsight(id: string, boss: number) {
        this.insights = this.insights.filter(x => !(x.id == id && x.boss == boss));
    }

    setInsightSelected(id: string, boss: number, selected: boolean) {
        selected ? this.selectInsight(id, boss) : this.deselectInsight(id, boss);
    }

    get filters(): SelectedFilter[] {
        let filterParams: SelectedFilter[] = [];

        if (this.queryParams.filters == undefined)
            return filterParams;

        try {
            this.queryParams.filters.split(",").forEach(groupAndFilters => {
                let split = groupAndFilters.split("-");
                let group = split[0];
                split[1].match(/(..?)/g).forEach(id => filterParams.push(new SelectedFilter(id, group)));
            });
        } catch (error) {
            return filterParams;
        }

        return filterParams;
    }

    set filters(value: SelectedFilter[]) {
        let filtersPerGroup: SelectedFilter[][] = [];
        value.forEach(x => {
            let filter = new SelectedFilter(x.id, x.group);
            let existingIndex = filtersPerGroup.findIndex(y => y.some(z => z.group == x.group));
            if (existingIndex === -1) {
                filtersPerGroup.push([filter]);
            } else {
                filtersPerGroup[existingIndex].push(filter);
            }
        });

        let filterQueryString = filtersPerGroup.map(x => `${x[0].group}-${x.map(y => y.id).join("")}`).join(",");

        this.queryParams.filters = filterQueryString == "" ? undefined : filterQueryString;

        this.updateQueryParams();
    }

    selectFiltersFromConfigs(configs: EventConfig[]) {
        if (configs.every(x => x.show == x.showByDefault)) {
            this.filters = [];
        } else {
            this.filters = configs.filter(x => x.eventType != "phase" && x.eventType != "title" && x.show).map(x => new SelectedFilter(x.id, x.group));
        }
    }

    get phases(): SelectedPhase[] {
        let phaseParams: SelectedPhase[] = [];

        if (this.queryParams.phases == undefined)
            return phaseParams;

        try {
            this.queryParams.phases.split(",").forEach(groupAndPhases => {
                let split = groupAndPhases.split("-");
                let group = split[0];
                split[1].match(/(!?..?)/g).forEach(phase => {
                    let selected = phase.indexOf("!") == -1;
                    let id = phase.split("!").join("");
                    phaseParams.push(new SelectedPhase(id, group, selected));
                });
            });
        } catch (error) {
            return phaseParams;
        }

        return phaseParams;
    }

    set phases(value: SelectedPhase[]) {
        let phasesPerGroup: SelectedPhase[][] = [];
        value.forEach(x => {
            let phase = new SelectedPhase(x.id, x.group, x.selected);
            let existingIndex = phasesPerGroup.findIndex(y => y.some(z => z.group == x.group));
            if (existingIndex === -1) {
                phasesPerGroup.push([phase]);
            } else {
                phasesPerGroup[existingIndex].push(phase);
            }
        });

        let phaseQueryString = phasesPerGroup.map(x => `${x[0].group}-${x.map(y => `${y.selected ? "" : "!"}${y.id}`).join("")}`).join(",");

        this.queryParams.phases = phaseQueryString == "" ? undefined : phaseQueryString;

        this.updateQueryParams();
    }

    selectPhasesFromEvents(events: FightEvent[]) {
        let phaseEvents = events.filter(x => x.config && x.config.eventType == "phase").map(x => <PhaseChangeEvent>x);
        if (phaseEvents.every(x => x.show == !x.config.collapsedByDefault)) {
            this.phases = [];
        } else {
            this.phases = phaseEvents.map(x => new SelectedPhase(x.config.id, x.config.group, x.show));
        }
    }

    get focuses(): SelectedFocus[] {
        let focusIds: string[] = this.queryParams.focuses == undefined ? [] : this.queryParams.focuses.split(",");
        return focusIds
            .map(id => this.availableFocuses.find(focus => focus.id == id))
            .filter(focus => focus != undefined);
    }

    set focuses(value: SelectedFocus[]) {
        if (value) {
            this.queryParams.focuses = value.map(focus => focus.id).join(",");
        } else {
            this.queryParams.focuses = undefined;
        }

        this.updateQueryParams();
    }

}

export class SelectedInsight {
    constructor(
        public id: string,
        public boss: number
    ) { }
}

export class SelectedFilter {
    constructor(
        public id: string,
        public group: string
    ) { }
}

export class SelectedPhase {
    constructor(
        public id: string,
        public group: string,
        public selected: boolean
    ) { }
}

export class SelectedFocus {
    constructor(
        public id: string,
        public includes: string[]
    ) { }
}
