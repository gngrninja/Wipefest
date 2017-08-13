import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LocalStorage } from "../shared/local-storage";

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    constructor(private router: Router, private localStorage: LocalStorage) { }

    character: string;
    characterRealm: string;
    characterRegion: string;
    favouriteCharacterIsSet: boolean;

    guild: string;
    guildRealm: string;
    guildRegion: string;
    favouriteGuildIsSet: boolean;

    reportId = "";

    ngOnInit() {
        this.character = this.localStorage.get("character") || "";
        this.characterRealm = this.localStorage.get("characterRealm") || "";
        this.characterRegion = this.localStorage.get("characterRegion") || "";
        this.favouriteCharacterIsSet = this.character ? true : false;

        this.guild = this.localStorage.get("guild") || "";
        this.guildRealm = this.localStorage.get("guildRealm") || "";
        this.guildRegion = this.localStorage.get("guildRegion") || "";
        this.favouriteGuildIsSet = this.guild ? true : false;
    }

    toggleFavouriteCharacter() {
        if (this.favouriteCharacterIsSet) {
            this.localStorage.remove("character");
            this.localStorage.remove("characterRealm");
            this.localStorage.remove("characterRegion");

            this.favouriteCharacterIsSet = false;
        } else {
            this.localStorage.set("character", this.character);
            this.localStorage.set("characterRealm", this.characterRealm);
            this.localStorage.set("characterRegion", this.characterRegion);

            this.favouriteCharacterIsSet = true;
        }
    }

    toggleFavouriteGuild() {
        if (this.favouriteGuildIsSet) {
            this.localStorage.remove("guild");
            this.localStorage.remove("guildRealm");
            this.localStorage.remove("guildRegion");

            this.favouriteGuildIsSet = false;
        } else {
            this.localStorage.set("guild", this.guild);
            this.localStorage.set("guildRealm", this.guildRealm);
            this.localStorage.set("guildRegion", this.guildRegion);

            this.favouriteGuildIsSet = true;
        }
    }

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
