import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

    constructor(private router: Router) { }

    character = "";
    characterRealm = "";
    characterRegion = "";

    guild = "";
    guildRealm = "";
    guildRegion = "";

    reportId = "";

    searchByCharacter() {
        if (this.character.trim() && this.characterRealm.trim() && this.characterRegion.trim()) {
            this.router.navigate([`/character/${this.character.trim()}/${this.characterRealm.trim()}/${this.characterRegion.trim()}`]);
        }
    }

    searchByGuild() {
        if (this.guild.trim() && this.guildRealm.trim() && this.guildRegion.trim()) {

        }
    }

    searchByReport() {
        if (this.reportId.trim()) {
            this.router.navigate([`/report/${this.reportId.trim()}`]);
        }
    }

}
