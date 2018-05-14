import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Raid } from 'app/raid/raid';
import { Fight, Report } from 'app/warcraft-logs/report';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import {
  ReportDto,
  FightInfo,
  RaidDto,
  EventConfig
} from '@wipefest/api-sdk/dist/lib/models';

@Injectable()
export class WipefestService {
  selectedPage: Observable<Page>;
  selectedReport: Observable<ReportDto>;
  selectedFight: Observable<FightInfo>;
  selectedRaid: Observable<RaidDto>;
  selectedConfigs: Observable<EventConfig[]>;

  private selectedPage$: BehaviorSubject<Page> = new BehaviorSubject<Page>(
    Page.None
  );
  private selectedReport$: BehaviorSubject<ReportDto> = new BehaviorSubject<
    ReportDto
  >(null);
  private selectedFight$: BehaviorSubject<FightInfo> = new BehaviorSubject<
    FightInfo
  >(null);
  private selectedRaid$: BehaviorSubject<RaidDto> = new BehaviorSubject<
    RaidDto
  >(null);
  private selectedEventConfigs$: BehaviorSubject<
    EventConfig[]
  > = new BehaviorSubject<EventConfig[]>([]);

  private errors: Response[] = [];

  constructor() {
    this.selectedPage = this.selectedPage$.asObservable();
    this.selectedReport = this.selectedReport$.asObservable();
    this.selectedFight = this.selectedFight$.asObservable();
    this.selectedRaid = this.selectedRaid$.asObservable();
    this.selectedConfigs = this.selectedEventConfigs$.asObservable();
  }

  selectPage(page: Page): void {
    this.selectedPage$.next(page);
  }

  selectReport(report: ReportDto): void {
    this.selectedReport$.next(report);
  }

  selectFight(fight: FightInfo): void {
    this.selectedFight$.next(fight);
  }

  selectRaid(raid: RaidDto): void {
    this.selectedRaid$.next(raid);
  }

  selectConfigs(configs: EventConfig[]): void {
    this.selectedEventConfigs$.next(configs);
  }

  throwError(error: Response): void {
    this.errors.push(error);
  }

  getLastError(): Response {
    if (this.errors.length === 0) {
      return null;
    }

    return this.errors[this.errors.length - 1];
  }
}

export enum Page {
  None,
  Welcome,
  CharacterSearchResults,
  GuildSearchResults,
  ReportSummary,
  FightSummary,
  GetInvolved,
  News
}
