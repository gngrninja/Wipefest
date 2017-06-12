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
        if (this.clean(this.character) && this.clean(this.characterRealm) && this.clean(this.characterRegion)) {
            this.router.navigate([`/character/${this.clean(this.character)}/${this.clean(this.characterRealm)}/${this.clean(this.characterRegion)}`]);
        }
    }

    searchByGuild() {
        if (this.clean(this.guild) && this.clean(this.guildRealm) && this.clean(this.guildRegion)) {
            this.router.navigate([`/guild/${this.clean(this.guild)}/${this.clean(this.guildRealm)}/${this.clean(this.guildRegion)}`]);
        }
    }

    searchByReport() {
        if (this.reportId.trim()) {
            this.router.navigate([`/report/${this.clean(this.reportId)}`]);
        }
    }

    clean(input: string): string {
        return input.trim().replace(/ /g, "-");
    }

}
