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

}

