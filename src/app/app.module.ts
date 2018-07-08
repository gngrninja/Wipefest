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
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { MarkdownModule } from 'ngx-md';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
// Importing this doesn't work in ng build --prod so inlining here for now
const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: './assets',
  onMonacoLoad: onMonacoLoad
};
export function onMonacoLoad(): void {
  const id = 'event-configs.json';
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    allowComments: true,
    schemas: [
      {
        uri: 'event-configs.json',
        fileMatch: [id],
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description:
                  'A 2 character alphanumeric ID that uniquely identifies this config within its group. Stored in the URL when saving state.',
                examples: ['0A', 'T2'],
                minLength: 2,
                maxLength: 2,
                pattern: '[0-9a-zA-Z]{2}'
              },
              name: {
                type: 'string',
                description:
                  'A friendly name for the event. This is used in the left-hand filter menu. If multiple event configs have the same name and tags, their events will be combined into the same "row" in the left-hand filter menu (so they are filtered on/off at the same time). This is mostly just used for stacking tank debuffs as the "debuff" and "debuffstack" events usually want to be combined.'
              },
              tags: {
                type: 'array',
                description:
                  'These tags help to organise the filters in the left-hand filter menu. The first tag will be the main heading for that filter group, and the second tag will be the subheading. For bosses, the first tag is typically "boss" / "player" / "raid" / "spawn", and the second tag is typically "ability" / "buff" / "debuff" / "damage" / "interrupt".',
                minItems: 1,
                maxItems: 2,
                items: {
                  type: 'string',
                  examples: ['boss', 'ability']
                }
              },
              show: {
                type: 'boolean',
                description:
                  "This property determines whether, on initial page load, the event is shown (true) or filtered (false). Be careful not to have too many events defaulting to be shown, as the timeline can easily get cluttered with lots of frequent events that the user isn't necessarily concerned about.",
                default: true
              },
              eventType: {
                description:
                  'Mostly determines what the event title says. For example, an ability event typically reads "X cast Y on Z", but a debuff event might read "X applied Y to Z". "debuff" / "debuffstack" / "removedebuff" events can also be used for buffs.',
                enum: [
                  'ability',
                  'debuff',
                  'debuffstack',
                  'removedebuff',
                  'damage',
                  'phase',
                  'interrupt',
                  'spawn',
                  'title',
                  'death',
                  'heroism'
                ]
              },
              friendly: {
                type: 'boolean',
                description:
                  'Determines which side of the timeline the event title will appear. Events on the left should be events that the raid had some control over, and should have a friendly value of true. Events on the right should be events that the raid didn\'t have much control over, and should have a friendly value of false. Also determines the phrasing of the event title. For example, a friendly debuff event might read "X gains Y from Z", and an unfriendly debuff event might read "Z applied Y to X". If the default value of friendly is not correct, then simply override it by setting this property.',
                default: true
              },
              filter: {
                type: 'object',
                description:
                  'The filter determines which Warcraft Logs events are used to create Wipefest events. Most of the time, one Warcraft Logs event will become one Wipefest event, but there are also filter properties that will allow you to collapse several Warcraft Logs events into a single Wipefest event.',
                properties: {
                  type: {
                    description: 'The Warcraft Logs type of the event.',
                    enum: [
                      'begincast',
                      'cast',
                      'miss',
                      'damage',
                      'heal',
                      'absorbed',
                      'healabsorbed',
                      'applybuff',
                      'applydebuff',
                      'applybuffstack',
                      'applydebuffstack',
                      'refreshbuff',
                      'refreshdebuff',
                      'removebuff',
                      'removedebuff',
                      'removebuffstack',
                      'removedebuffstack',
                      'summon',
                      'create',
                      'death',
                      'destroy',
                      'extraattacks',
                      'aurabroken',
                      'dispel',
                      'interrupt',
                      'steal',
                      'leech',
                      'energize',
                      'drain',
                      'resurrect',
                      'encounterstart',
                      'encounterend'
                    ]
                  },
                  types: {
                    type: 'array',
                    description:
                      'You can specify that you want to filter to multiple Warcraft Logs types using the filter.types array instead of filter.type. For example, a Wipefest damage eventType will often filter to both damage and absorb Warcraft Logs types, so as to include events where a player was hit but absorbed all of the damage.',
                    items: {
                      description: 'The Warcraft Logs type of the event.',
                      enum: [
                        'begincast',
                        'cast',
                        'miss',
                        'damage',
                        'heal',
                        'absorbed',
                        'healabsorbed',
                        'applybuff',
                        'applydebuff',
                        'applybuffstack',
                        'applydebuffstack',
                        'refreshbuff',
                        'refreshdebuff',
                        'removebuff',
                        'removedebuff',
                        'removebuffstack',
                        'removedebuffstack',
                        'summon',
                        'create',
                        'death',
                        'destroy',
                        'extraattacks',
                        'aurabroken',
                        'dispel',
                        'interrupt',
                        'steal',
                        'leech',
                        'energize',
                        'drain',
                        'resurrect',
                        'encounterstart',
                        'encounterend'
                      ]
                    }
                  },
                  ability: {
                    type: 'object',
                    description:
                      'As well as the type of the Warcraft Logs event, Wipefest needs to know what ability to filter to.',
                    properties: {
                      id: {
                        type: 'integer',
                        description:
                          'The numeric World of Warcraft spell ID for that ability. This is the same ID that is used in Weak Auras, Warcraft Logs, WoWDB, Wowhead etc.',
                        examples: [244399]
                      },
                      ids: {
                        type: 'array',
                        description:
                          'To filter to multiple abilities, specify their ids in the filter.ability.ids array, instead of using filter.ability.id.',
                        uniqueItems: true,
                        items: {
                          type: 'integer',
                          description:
                            'The numeric World of Warcraft spell ID for that ability. This is the same ID that is used in Weak Auras, Warcraft Logs, WoWDB, Wowhead etc.',
                          examples: [244399]
                        }
                      }
                    }
                  }
                }
              },
              difficulties: {
                type: 'array',
                description:
                  'Determines which raid difficulties the event config will be loaded for. 3 = Normal, 4 = Heroic, and 5 = Mythic. This is useful for when a mechanic significantly differs from heroic to mythic, and you want to load different versions of the event config for each difficulty.',
                uniqueItems: true,
                items: {
                  enum: [3, 4, 5]
                }
              }
            },
            required: ['name', 'tags', 'show', 'eventType']
          }
        }
      }
    ]
  });
}

import { WipefestAPI } from '@wipefest/api-sdk';
import {
  ServiceClient,
  ServiceClientOptions,
  BaseFilter,
  WebResource,
  HttpOperationResponse,
  LogFilter
} from 'ms-rest-js';

import {
  EncountersService,
  SpecializationsService,
  LinkService
} from '@wipefest/core';

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
import { FightTitleComponent } from './fight-summary/title/fight-title.component';
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
import { DeveloperConsoleComponent } from './developer-console/developer-console.component';
import { DeveloperConsoleTestCaseComponent } from './developer-console/test-case/developer-console-test-case.component';
import { DeveloperConsoleExamplesComponent } from './developer-console/examples/developer-console-examples.component';

// Core UI
import {
  AsideToggleDirective,
  MobileAsideMenuToggleDirective
} from './core-ui/aside.directive';
import { BreadcrumbsComponent } from './core-ui/breadcrumb.component';
import { NAV_DROPDOWN_DIRECTIVES } from './core-ui/nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './core-ui/sidebar.directive';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SpinnerComponent,
    ProgressBarComponent,
    FightSummaryComponent,
    FightTitleComponent,
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
    DeveloperConsoleComponent,
    DeveloperConsoleTestCaseComponent,
    DeveloperConsoleExamplesComponent,
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
          path: 'develop/:workspaceId/:workspaceRevision',
          component: DeveloperConsoleComponent
        },
        {
          path: 'develop/:workspaceId',
          component: DeveloperConsoleComponent
        },
        {
          path: 'develop',
          component: DeveloperConsoleComponent
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
    NgbModule.forRoot(),
    MonacoEditorModule.forRoot(monacoConfig)
  ],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    LoggerService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    WipefestService,
    NewsService,
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
    { provide: EncountersService, useValue: new EncountersService() },
    { provide: SpecializationsService, useValue: new SpecializationsService() },
    { provide: LinkService, useValue: new LinkService() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export class HttpFilter extends BaseFilter {
  after(response: HttpOperationResponse): Promise<HttpOperationResponse> {
    // For some reason, this doesn't happen automatically
    // This property *does* exist, even though accessing it via "." gives a compiler error 🤷
    // tslint:disable-next-line:no-string-literal
    response['parsedBody'] = response.bodyAsJson;
    return Promise.resolve(response);
  }
}
