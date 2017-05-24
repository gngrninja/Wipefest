﻿import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { WarcraftLogsService } from './warcraft-logs/warcraft-logs.service';
import { EventsComponent } from './events/events.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FightSummaryComponent } from './fight-summary/fight-summary.component';
import { WipefestService } from "app/wipefest.service";

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    NavbarComponent,
    SpinnerComponent,
    FightSummaryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [ WarcraftLogsService, WipefestService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
