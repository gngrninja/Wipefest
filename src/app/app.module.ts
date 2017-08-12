import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { WarcraftLogsService } from './warcraft-logs/warcraft-logs.service';
import { NavbarComponent } from './navbar/navbar.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FightSummaryComponent } from './fight-summary/fight-summary.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WipefestService } from "app/wipefest.service";
import { ReportSummaryComponent } from './report-summary/report-summary.component';
import { FightEventsComponent } from './fight-events/fight-events.component';
import { AbilityIconComponent } from './fight-events/ability-icon.component';
import { SearchComponent } from './search/search.component';
import { CharacterSearchResultsComponent } from './character-search-results/character-search-results.component';
import { SpecIconComponent } from './character-search-results/spec-icon.component';
import { ErrorComponent } from './error/error.component';
import { NotFoundComponent } from './error/not-found.component';
import { GuildSearchResultsComponent } from './guild-search-results/guild-search-results.component';
import { ToggleableSearchComponent } from './search/toggleable-search.component';
import { QueryService } from './warcraft-logs/query.service';
import { EventConfigService } from "app/event-config/event-config.service";
import { EventService } from "app/events/event.service";
import { FightSummaryFiltersComponent } from './fight-summary-filters/fight-summary-filters.component';
import { ClassesService } from "app/warcraft-logs/classes.service";
import { FightSummaryRaidComponent } from "app/fights-summary-raid/fight-summary-raid.component";

// Core UI
import { NAV_DROPDOWN_DIRECTIVES } from './core-ui/nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './core-ui/sidebar.directive';
import { AsideToggleDirective, MobileAsideMenuToggleDirective } from './core-ui/aside.directive';
import { BreadcrumbsComponent } from './core-ui/breadcrumb.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        SpinnerComponent,
        FightSummaryComponent,
        WelcomeComponent,
        ReportSummaryComponent,
        FightEventsComponent,
        AbilityIconComponent,
        SearchComponent,
        CharacterSearchResultsComponent,
        SpecIconComponent,
        ErrorComponent,
        NotFoundComponent,
        GuildSearchResultsComponent,
        ToggleableSearchComponent,
        FightSummaryFiltersComponent,
        FightSummaryRaidComponent,
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
                path: "character/:character/:realm/:region",
                component: CharacterSearchResultsComponent
            },
            {
                path: "guild/:guild/:realm/:region",
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
        NgbModule.forRoot()
    ],
    providers: [
        WarcraftLogsService,
        WipefestService,
        EventConfigService,
        QueryService,
        EventService,
        ClassesService],
    bootstrap: [AppComponent]
})
export class AppModule { }
