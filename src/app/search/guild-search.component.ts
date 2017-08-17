﻿import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { LocalStorage } from "app/shared/local-storage";

@Component({
    selector: 'guild-search',
    templateUrl: './guild-search.component.html',
    styleUrls: ['./search.component.css']
})
export class GuildSearchComponent implements OnInit {

    constructor(private router: Router, private localStorage: LocalStorage) { }

    @Input() guild: string;
    @Input() realm: string;
    @Input() region: string;
    favouriteGuildIsSet: boolean;

    ngOnInit() {
        this.guild = this.guild || this.localStorage.get("guild") || "";
        this.realm = this.realm || this.localStorage.get("realm") || "";
        this.region = this.region || this.localStorage.get("region") || "";
        this.update();
    }

    update() {
        this.favouriteGuildIsSet =
            this.guild == this.localStorage.get("guild") &&
            this.realm == this.localStorage.get("realm") &&
            this.region == this.localStorage.get("region") &&
            !!this.guild && !!this.realm && !!this.region;
    }

    toggleFavouriteGuild() {
        if (this.favouriteGuildIsSet) {
            this.localStorage.remove("guild");
            this.localStorage.remove("realm");
            this.localStorage.remove("region");

            this.favouriteGuildIsSet = false;
        } else {
            this.localStorage.set("guild", this.guild);
            this.localStorage.set("realm", this.realm);
            this.localStorage.set("region", this.region);

            this.favouriteGuildIsSet = true;
        }
    }

    searchByGuild() {
        if (this.clean(this.guild) && this.clean(this.realm) && this.clean(this.region)) {
            this.router.navigate([`/guild/${this.guild}/${this.clean(this.realm)}/${this.clean(this.region)}`]);
        }
    }

    clean(input: string): string {
        if (!input) return "";
        return input.trim().replace(/ /g, "-").replace(/'/g, "");
    }

}
