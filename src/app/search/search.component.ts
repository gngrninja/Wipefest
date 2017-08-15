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

    guild: string;
    guildRealm: string;
    guildRegion: string;
    favouriteGuildIsSet: boolean;

    warcraftLogsLink = "";
    warcraftLogsLinkError = "";

    ngOnInit() {
        this.guild = this.localStorage.get("guild") || "";
        this.guildRealm = this.localStorage.get("guildRealm") || "";
        this.guildRegion = this.localStorage.get("guildRegion") || "";
        this.favouriteGuildIsSet = this.guild ? true : false;
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

    searchByGuild() {
        if (this.clean(this.guild) && this.clean(this.guildRealm) && this.clean(this.guildRegion)) {
            this.router.navigate([`/guild/${this.clean(this.guild)}/${this.clean(this.guildRealm)}/${this.clean(this.guildRegion)}`]);
        }
    }

    searchByLink() {
        this.router.navigate([`${this.parseLink()}`]);
    }

    parseLink() {
        let reportResults = this.warcraftLogsLink.match("\/reports\/[a-zA-Z0-9]*");

        if (!(reportResults && reportResults.length > 0)) {
            return null;
        }
        
        let reportId = reportResults[0].replace("\/reports\/", "");

        let fightResults = this.warcraftLogsLink.match("fight=[0-9]*");

        if (!(fightResults && fightResults.length > 0)) {
            return `/report/${reportId}`;
        }

        let fightId = fightResults[0].replace("fight=", "");

        return `/report/${reportId}/fight/${fightId}`;
    }

    validateLink() {
        if (this.warcraftLogsLink == "") {
            this.warcraftLogsLinkError = "";
            return;
        }

        let route = this.parseLink();
        if (route) {
            this.warcraftLogsLinkError = "";
        } else {
            this.warcraftLogsLinkError = "Invalid link";
        }
    }

    clean(input: string): string {
        return input.trim().replace(/ /g, "-").replace(/'/g, "");
    }

}
