import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { WarcraftLogsService } from './warcraft-logs/warcraft-logs.service';
import { EventsComponent } from './events/events.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FightSummaryComponent } from './fight-summary/fight-summary.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WipefestService } from "app/wipefest.service";
import { ReportSummaryComponent } from './report-summary/report-summary.component';

@NgModule({
    declarations: [
        AppComponent,
        EventsComponent,
        NavbarComponent,
        SpinnerComponent,
        FightSummaryComponent,
        WelcomeComponent,
        ReportSummaryComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot([
            {
                path: "report/:reportId/fight/:fightId",
                component: FightSummaryComponent
            },
            {
                path: "report/:reportId",
                component: ReportSummaryComponent
            },
            {
                path: "",
                component: WelcomeComponent
            },
            {
                path: "**",
                redirectTo: ""
            }
        ]),
        NgbModule.forRoot()
    ],
    providers: [WarcraftLogsService, WipefestService],
    bootstrap: [AppComponent]
})
export class AppModule { }
