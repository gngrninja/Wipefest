import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { AppComponent } from './app.component';
import { WarcraftLogsService } from './warcraft-logs/warcraft-logs.service';
import { NavbarComponent } from './navbar/navbar.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FightSummaryComponent } from './fight-summary/fight-summary.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WipefestService } from "app/wipefest.service";
import { ReportSummaryComponent } from './report-summary/report-summary.component';
import { FightEventsComponent } from './fight-events/components/fight-events/fight-events.component';
import { FightEventComponent } from './fight-events/components/fight-event/fight-event.component';
import { TimelineFightEventComponent } from './fight-events/components/timeline-fight-event/timeline-fight-event.component';
import { TableFightEventComponent } from './fight-events/components/table-fight-event/table-fight-event.component';
import { AbilityIconComponent } from './shared/ability-icon.component';
import { SearchComponent } from './search/search.component';
import { CharacterSearchResultsComponent } from './character-search-results/character-search-results.component';
import { SpecIconComponent } from './character-search-results/spec-icon.component';
import { ErrorComponent } from './error/error.component';
import { NotFoundComponent } from './error/not-found.component';
import { GuildSearchResultsComponent } from './guild-search-results/guild-search-results.component';
import { ToggleableSearchComponent } from './search/toggleable-search.component';
import { QueryService } from './warcraft-logs/query.service';
import { EventConfigService } from "app/event-config/event-config.service";
import { FightEventService } from "./fight-events/services/fight-event.service";
import { FightSummaryFiltersComponent } from './fight-summary-filters/fight-summary-filters.component';
import { FightSummaryFilterCategoryComponent } from './fight-summary-filters/fight-summary-filter-category.component';
import { ClassesService } from "app/warcraft-logs/classes.service";
import { FightSummaryRaidComponent } from "app/fights-summary-raid/fight-summary-raid.component";
import { FooterComponent } from "app/footer.component";
import { LocalStorage } from "app/shared/local-storage";
import { CharacterSearchComponent } from "app/search/character-search.component";
import { LinkSearchComponent } from "app/search/link-search.component";
import { GuildSearchComponent } from "app/search/guild-search.component";
import { LoggerService } from "app/shared/logger.service";
import { GlobalErrorHandler } from "app/shared/global-error-handler";
import { GetInvolvedComponent } from './get-involved/get-involved.component';
import { DiscordComponent } from "app/discord/discord.component";
import { AutoCompleteComponent } from "app/shared/autocomplete/auto-complete.component";
import { InsightsComponent } from "app/insights/components/insights.component";
import { InsightService } from "app/insights/services/insight.service";
import { StateService } from "app/shared/state.service";

// Core UI
import { NAV_DROPDOWN_DIRECTIVES } from './core-ui/nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './core-ui/sidebar.directive';
import { AsideToggleDirective, MobileAsideMenuToggleDirective } from './core-ui/aside.directive';
import { BreadcrumbsComponent } from './core-ui/breadcrumb.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SpinnerComponent,
    FightSummaryComponent,
    WelcomeComponent,
    ReportSummaryComponent,
    FightEventsComponent,
    FightEventComponent,
    TimelineFightEventComponent,
    TableFightEventComponent,
    AbilityIconComponent,
    SearchComponent,
    CharacterSearchComponent,
    GuildSearchComponent,
    LinkSearchComponent,
    CharacterSearchResultsComponent,
    SpecIconComponent,
    ErrorComponent,
    NotFoundComponent,
    GuildSearchResultsComponent,
    ToggleableSearchComponent,
    FightSummaryFiltersComponent,
    FightSummaryFilterCategoryComponent,
    FightSummaryRaidComponent,
    GetInvolvedComponent,
    DiscordComponent,
    AutoCompleteComponent,
    InsightsComponent,
    // Core UI
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    MobileAsideMenuToggleDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: "character/:character/:realm/:region/:zone",
        component: CharacterSearchResultsComponent
      },
      {
        path: "character/:character/:realm/:region",
        component: CharacterSearchResultsComponent
      },
      {
        path: "character",
        component: CharacterSearchResultsComponent
      },
      {
        path: "guild/:guild/:realm/:region",
        component: GuildSearchResultsComponent
      },
      {
        path: "guild",
        component: GuildSearchResultsComponent
      },
      {
        path: "report/:reportId/fight/:fightId",
        component: FightSummaryComponent
      },
      {
        path: "report/:reportId",
        component: ReportSummaryComponent
      },
      {
        path: "link?link=:link",
        component: ReportSummaryComponent
      },
      {
        path: "link",
        component: ReportSummaryComponent
      },
      {
        path: "discord",
        component: DiscordComponent
      },
      {
        path: "error",
        component: ErrorComponent
      },
      {
        path: "",
        component: WelcomeComponent
      },
      {
        path: "**",
        component: NotFoundComponent
      }
    ], { useHash: true }),
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    NgbModule.forRoot()
  ],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    LoggerService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    WarcraftLogsService,
    WipefestService,
    EventConfigService,
    QueryService,
    FightEventService,
    ClassesService,
    InsightService,
    LocalStorage,
    StateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
