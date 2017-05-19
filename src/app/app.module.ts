import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { WarcraftLogsApiService } from './warcraft-logs-api/warcraft-logs-api.service';
import { ZoneComponent } from './zone/zone.component';
import { RankingsComponent } from './rankings/rankings.component';
import { EventsComponent } from './events/events.component';
import { EventComponent } from './event/event.component'

@NgModule({
  declarations: [
    AppComponent,
    ZoneComponent,
    RankingsComponent,
    EventsComponent,
    EventComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [ WarcraftLogsApiService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
