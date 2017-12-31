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
      this.queryParams.ignore = queryParams["ignore"];
      this.queryParams.deathThreshold = Math.max(1, Math.min(<number> queryParams["deathThreshold"], 99));

      if (!environment.production) {
        console.log(this.queryParams);
      }
    });
  }

  private updateQueryParams() {
    this.router.navigate([this.router.url.split('?')[0]], { queryParams: this.queryParams })
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

