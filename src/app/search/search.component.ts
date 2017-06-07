import { Component } from '@angular/core';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

    character = "";
    characterRealm = "";
    characterRegion = "";

    guild = "";
    guildRealm = "";
    guildRegion = "";

    reportId = "";

}
