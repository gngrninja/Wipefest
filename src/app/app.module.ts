import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { WarcraftLogsApiService } from './warcraft-logs-api/warcraft-logs-api.service';
import { ZoneComponent } from './zone/zone.component';
import { RankingsComponent } from './rankings/rankings.component';
import { EventsComponent } from './events/events.component'

@NgModule({
  declarations: [
    AppComponent,
    ZoneComponent,
    RankingsComponent,
    EventsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ WarcraftLogsApiService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
