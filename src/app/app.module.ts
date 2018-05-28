import {
  Location,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { MarkdownModule } from 'ngx-md';

import { WipefestAPI } from '@wipefest/api-sdk';
import {
  ServiceClient,
  ServiceClientOptions,
  BaseFilter,
  WebResource,
  HttpOperationResponse,
  LogFilter
} from 'ms-rest-js';
import { EncountersService } from '@wipefest/core';

import { DiscordComponent } from 'app/discord/discord.component';
import { FightSummaryRaidComponent } from 'app/fights-summary-raid/fight-summary-raid.component';
import { FooterComponent } from 'app/footer.component';
import { InsightsComponent } from 'app/insights/components/insights.component';
import { NewsService } from 'app/news/services/news.service';
import { CharacterSearchComponent } from 'app/search/character-search.component';
import { GuildSearchComponent } from 'app/search/guild-search.component';
import { LinkSearchComponent } from 'app/search/link-search.component';
import { AutoCompleteComponent } from 'app/shared/autocomplete/auto-complete.component';
import { GlobalErrorHandler } from 'app/shared/global-error-handler';
import { LocalStorage } from 'app/shared/local-storage';
import { LoggerService } from 'app/shared/logger.service';
import { StateService } from 'app/shared/state.service';
import { ClassesService } from 'app/warcraft-logs/classes.service';
import { WipefestService } from 'app/wipefest.service';
import { AppComponent } from './app.component';
import { CharacterSearchResultsComponent } from './character-search-results/character-search-results.component';
import { SpecIconComponent } from './character-search-results/spec-icon.component';
import { ErrorComponent } from './error/error.component';
import { NotFoundComponent } from './error/not-found.component';
import { FightEventComponent } from './fight-events/components/fight-event/fight-event.component';
import { FightEventsComponent } from './fight-events/components/fight-events/fight-events.component';
import { TableFightEventComponent } from './fight-events/components/table-fight-event/table-fight-event.component';
import { TimelineFightEventComponent } from './fight-events/components/timeline-fight-event/timeline-fight-event.component';
import { FightSummaryFilterCategoryComponent } from './fight-summary-filters/fight-summary-filter-category.component';
import { FightSummaryFiltersComponent } from './fight-summary-filters/fight-summary-filters.component';
import { FightSummaryComponent } from './fight-summary/fight-summary.component';
import { GetInvolvedComponent } from './get-involved/get-involved.component';
import { GuildSearchResultsComponent } from './guild-search-results/guild-search-results.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NewsComponent } from './news/components/news.component';
import { ReportSummaryComponent } from './report-summary/report-summary.component';
import { SearchComponent } from './search/search.component';
import { ToggleableSearchComponent } from './search/toggleable-search.component';
import { AbilityIconComponent } from './shared/ability-icon.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ProgressBarComponent } from './shared/progress-bar.component';
import { WelcomeComponent } from './welcome/welcome.component';

// Core UI
import {
  AsideToggleDirective,
  MobileAsideMenuToggleDirective
} from './core-ui/aside.directive';
import { BreadcrumbsComponent } from './core-ui/breadcrumb.component';
import { NAV_DROPDOWN_DIRECTIVES } from './core-ui/nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './core-ui/sidebar.directive';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SpinnerComponent,
    ProgressBarComponent,
    FightSummaryComponent,
    WelcomeComponent,
    NewsComponent,
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
    MarkdownModule.forRoot(),
    RouterModule.forRoot(
      [
        {
          path: 'character/:character/:realm/:region/:zone',
          component: CharacterSearchResultsComponent
        },
        {
          path: 'character/:character/:realm/:region',
          component: CharacterSearchResultsComponent
        },
        {
          path: 'character',
          component: CharacterSearchResultsComponent
        },
        {
          path: 'guild/:guild/:realm/:region',
          component: GuildSearchResultsComponent
        },
        {
          path: 'guild',
          component: GuildSearchResultsComponent
        },
        {
          path: 'report/:reportId/fight/:fightId',
          component: FightSummaryComponent
        },
        {
          path: 'report/:reportId',
          component: ReportSummaryComponent
        },
        {
          path: 'link?link=:link',
          component: ReportSummaryComponent
        },
        {
          path: 'link',
          component: ReportSummaryComponent
        },
        {
          path: 'discord',
          component: DiscordComponent
        },
        {
          path: 'error',
          component: ErrorComponent
        },
        {
          path: 'news',
          component: NewsComponent
        },
        {
          path: '',
          component: NewsComponent
        },
        {
          path: '**',
          component: NotFoundComponent
        }
      ],
      { useHash: true }
    ),
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    NgbModule.forRoot()
  ],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    LoggerService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    WipefestService,
    NewsService,
    ClassesService,
    LocalStorage,
    StateService,
    {
      provide: WipefestAPI,
      useFactory: () => {
        return new WipefestAPI('https://api.wipefest.net/', {
          filters: [new HttpFilter()]
        });
      }
    },
    EncountersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

// Filthy hack to get around what seems to be a CORS bug in ms-rest-js
// ms-rest-js always sends Content-Type: application/json, which nginx is setup to support
// (can test that OPTIONS *does* work on https://www.test-cors.org/)
// However, behaviour seems to be that ms-rest-js is not making the GET request after the successful OPTIONS
// To get around this, this filter changes Content-Type to text/plain, making this a "simple" request
// Browsers do not pre-flight check for "simple" requests
// When the response comes back, need to set the "parsedBody" property to be the returned JSON
export class HttpFilter extends BaseFilter {
  before(request: WebResource): Promise<WebResource> {
    // Even though there is a requestOptions.headers property in ServiceClientOptions,
    // it doesn't seem to let us override Content-Type, so we have to do it here
    request.headers = { 'Content-Type': 'text/plain' };
    return Promise.resolve(request);
  }

  after(response: HttpOperationResponse): Promise<HttpOperationResponse> {
    // This property *does* exist, even though accessing it via "." gives a compiler error 🤷
    response['parsedBody'] = response.bodyAsJson;
    return Promise.resolve(response);
  }
}
