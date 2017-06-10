import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot([
            {
                path: "character/:character/:realm/:region",
                component: CharacterSearchResultsComponent
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
    providers: [WarcraftLogsService, WipefestService],
    bootstrap: [AppComponent]
})
export class AppModule { }
