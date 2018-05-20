import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FightEvent } from 'app/fight-events/models/fight-event';
import { PhaseChangeEvent } from 'app/fight-events/models/phase-change-event';
import { Report } from 'app/warcraft-logs/report';
import { WipefestService } from 'app/wipefest.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Rx';
import {
  ReportDto,
  EventConfig,
  EventDto
} from '@wipefest/api-sdk/dist/lib/models';

@Injectable()
export class StateService {
  queryParams: any;
  configs: EventConfig[];
  private report: ReportDto;
  private availableFocuses: SelectedFocus[] = [];

  constructor(
    private wipefestService: WipefestService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(queryParams => {
      this.queryParams = {};
      this.queryParams.ignore = queryParams.hasOwnProperty('ignore')
        ? queryParams.ignore
        : undefined;
      this.queryParams.deathThreshold = queryParams.hasOwnProperty(
        'deathThreshold'
      )
        ? Math.max(1, Math.min(queryParams.deathThreshold as number, 99))
        : undefined;
      this.queryParams.insights = queryParams.hasOwnProperty('insights')
        ? queryParams.insights
        : undefined;
      this.queryParams.filters = queryParams.hasOwnProperty('filters')
        ? queryParams.filters
        : undefined;
      this.queryParams.phases = queryParams.hasOwnProperty('phases')
        ? queryParams.phases
        : undefined;
      this.queryParams.focuses = queryParams.hasOwnProperty('focuses')
        ? queryParams.focuses
        : undefined;

      this.queryParams = this.clean(this.queryParams);

      if (!environment.production) {
        console.log(this);
      }
    });

    this.wipefestService.selectedReport.subscribe(
      report => (this.report = report)
    );

    this.wipefestService.selectedRaid.subscribe(raid => {
      this.availableFocuses = raid
        ? raid.players.map(player => {
          const friendly = this.report.friendlies.find(
            friendly => friendly.name == player.name
          );
          return new SelectedFocus(friendly.id.toString(), [
            player.specialization.include,
            player.specialization.generalInclude
          ]);
        })
        : [];
    });

    this.wipefestService.selectedConfigs.subscribe(configs => {
      this.configs = configs;
    });
  }

  get changes(): Observable<Params> {
    return Observable.merge(
      this.route.queryParams,
      this.wipefestService.selectedRaid
    );
  }

  get ignore(): boolean {
    return this.queryParams.ignore == 'true';
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
    const insightParams: SelectedInsight[] = [];

    if (this.queryParams.insights == undefined) {
      return insightParams;
    }

    try {
      this.queryParams.insights.split(',').forEach(bossAndInsights => {
        const split = bossAndInsights.split('-');
        const boss = split[0] as number;
        split[1]
          .split('')
          .forEach(id => insightParams.push(new SelectedInsight(id, boss)));
      });
    } catch (error) {
      return insightParams;
    }

    return insightParams;
  }

  set insights(value: SelectedInsight[]) {
    const insightsPerBoss: SelectedInsight[][] = [];
    value.forEach(x => {
      const insight = new SelectedInsight(x.id, x.boss);
      const existingIndex = insightsPerBoss.findIndex(y =>
        y.some(z => z.boss === x.boss)
      );
      if (existingIndex === -1) {
        insightsPerBoss.push([insight]);
      } else {
        insightsPerBoss[existingIndex].push(insight);
      }
    });

    const insightQueryString = insightsPerBoss
      .map(x => `${x[0].boss}-${x.map(y => y.id).join('')}`)
      .join(',');

    this.queryParams.insights =
      insightQueryString === '' ? undefined : insightQueryString;

    this.updateQueryParams();
  }

  isInsightSelected(id: string, boss: number): boolean {
    // tslint:disable-next-line:triple-equals
    return this.insights.some(x => x.id === id && x.boss == boss);
  }

  selectInsight(id: string, boss: number): void {
    if (!this.isInsightSelected(id, boss)) {
      const selectedInsights = this.insights;
      selectedInsights.push(new SelectedInsight(id, boss));

      this.insights = selectedInsights;
    }
  }

  deselectInsight(id: string, boss: number): void {
    // tslint:disable-next-line:triple-equals
    this.insights = this.insights.filter(x => !(x.id == id && x.boss == boss));
  }

  setInsightSelected(id: string, boss: number, selected: boolean): void {
    selected ? this.selectInsight(id, boss) : this.deselectInsight(id, boss);
  }

  get filters(): SelectedFilter[] {
    const filterParams: SelectedFilter[] = [];

    if (this.queryParams.filters == undefined) {
      return filterParams;
    }

    try {
      this.queryParams.filters.split(',').forEach(groupAndFilters => {
        const split = groupAndFilters.split('-');
        const group = split[0];
        split[1]
          .match(/(..?)/g)
          .forEach(id => filterParams.push(new SelectedFilter(id, group)));
      });
    } catch (error) {
      return filterParams;
    }

    return filterParams;
  }

  set filters(value: SelectedFilter[]) {
    const filtersPerGroup: SelectedFilter[][] = [];
    value.forEach(x => {
      const filter = new SelectedFilter(x.id, x.group);
      const existingIndex = filtersPerGroup.findIndex(y =>
        y.some(z => z.group == x.group)
      );
      if (existingIndex === -1) {
        filtersPerGroup.push([filter]);
      } else {
        filtersPerGroup[existingIndex].push(filter);
      }
    });

    const filterQueryString = filtersPerGroup
      .map(x => `${x[0].group}-${x.map(y => y.id).join('')}`)
      .join(',');

    this.queryParams.filters =
      filterQueryString == '' ? undefined : filterQueryString;

    this.updateQueryParams();
  }

  selectFiltersFromConfigs(configs: EventConfig[]) {
    if (configs.every(x => x.show == x.showByDefault)) {
      this.filters = [];
    } else {
      this.filters = configs
        .filter(x => x.eventType != 'phase' && x.eventType != 'title' && x.show)
        .map(x => new SelectedFilter(x.id, x.group));
    }
  }

  get phases(): SelectedPhase[] {
    const phaseParams: SelectedPhase[] = [];

    if (this.queryParams.phases == undefined) {
      return phaseParams;
    }

    try {
      this.queryParams.phases.split(',').forEach(groupAndPhases => {
        const split = groupAndPhases.split('-');
        const group = split[0];
        phaseParams.push(
          ...split[1]
            .split('')
            .map((c, index) => new SelectedPhase(index, group, c === '1'))
        );
      });
    } catch (error) {
      return phaseParams;
    }

    return phaseParams;
  }

  set phases(value: SelectedPhase[]) {
    const phasesPerGroup: SelectedPhase[][] = [];
    value.forEach(x => {
      const phase = new SelectedPhase(x.index, x.group, x.selected);
      const existingIndex = phasesPerGroup.findIndex(y =>
        y.some(z => z.group == x.group)
      );
      if (existingIndex === -1) {
        phasesPerGroup.push([phase]);
      } else {
        phasesPerGroup[existingIndex].push(phase);
      }
    });

    const phaseQueryString = phasesPerGroup
      .map(
        x =>
          `${x[0].group}-${x
            .sort((a, b) => a.index - b.index)
            .map(y => `${y.selected ? '1' : '0'}`)
            .join('')}`
      )
      .join(',');

    this.queryParams.phases =
      phaseQueryString == '' ? undefined : phaseQueryString;

    this.updateQueryParams();
  }

  togglePhase(index: number, group: string, totalPhases: number): void {
    if (this.phases === undefined) this.phases = [];
    let phases = this.phases;

    const groupPhases = phases.filter(x => x.group === group);
    if (groupPhases.length !== totalPhases) {
      const newGroupPhases = Array.from(
        { length: totalPhases },
        (v, i) => i
      ).map(
        (_, i) =>
          new SelectedPhase(
            i,
            group,
            groupPhases[i] !== undefined ? groupPhases[i].selected : true
          )
      );
      phases = this.phases
        .filter(x => x.group !== group)
        .concat(...newGroupPhases);
    }
    const phase = phases.find(x => x.group === group && x.index === index);
    phase.selected = !phase.selected;

    this.phases = phases;
  }

  getConfig(event: EventDto): EventConfig {
    return this.configs.find(
      x => x.id === event.configId && x.group === event.configGroup
    );
  }

  get focuses(): SelectedFocus[] {
    const focusIds: string[] =
      this.queryParams.focuses === undefined
        ? []
        : this.queryParams.focuses.split(',');
    return focusIds
      .map(id => this.availableFocuses.find(focus => focus.id === id))
      .filter(focus => focus !== undefined);
  }

  set focuses(value: SelectedFocus[]) {
    if (value) {
      this.queryParams.focuses = value.map(focus => focus.id).join(',');
    } else {
      this.queryParams.focuses = undefined;
    }

    this.updateQueryParams();
  }

  private updateQueryParams(): void {
    this.queryParams = this.clean(this.queryParams);
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: this.queryParams,
      replaceUrl: true
    });
  }

  private clean(obj: any): any {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }

    return obj;
  }
}

export class SelectedInsight {
  constructor(public id: string, public boss: number) {}
}

export class SelectedFilter {
  constructor(public id: string, public group: string) {}
}

export class SelectedPhase {
  constructor(
    public index: number,
    public group: string,
    public selected: boolean
  ) {}
}

export class SelectedFocus {
  constructor(public id: string, public includes: string[]) {}
}
