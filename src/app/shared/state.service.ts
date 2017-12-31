import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { environment } from "environments/environment";

@Injectable()
export class StateService {

    queryParams: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router) {

        this.route.queryParams.subscribe(queryParams => {
            this.queryParams = {};
            this.queryParams.ignore = queryParams.hasOwnProperty("ignore") ? queryParams["ignore"] : undefined;
            this.queryParams.deathThreshold = queryParams.hasOwnProperty("deathThreshold") ? Math.max(1, Math.min(<number>queryParams["deathThreshold"], 99)) : undefined;
            this.queryParams.insights = queryParams.hasOwnProperty("insights") ? queryParams.insights : undefined;

            this.queryParams = this.clean(this.queryParams);

            if (!environment.production) {
                console.log(this.queryParams);
            }
        });
    }

    private updateQueryParams() {
        this.router.navigate([this.router.url.split('?')[0]], { queryParams: this.queryParams })
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

}

export class SelectedInsight {
    constructor(
        public id: string,
        public boss: number
    ) { }
}
