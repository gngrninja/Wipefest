import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { LocalStorage } from "app/shared/local-storage";
import { LoggerService } from "app/shared/logger.service";
import { AutoCompleteSelectedValue, AutoCompleteCategory } from "app/shared/autocomplete/auto-complete.component";
import { Realms } from "app/shared/realms";

@Component({
    selector: 'guild-search',
    templateUrl: './guild-search.component.html',
    styleUrls: ['./search.component.css']
})
export class GuildSearchComponent implements OnInit {

    data = [];

    constructor(private router: Router, private localStorage: LocalStorage, private logger: LoggerService) { }

    @Input() guild: string;
    @Input() realm: string;
    @Input() region: string;

    private guildKey = "guild";
    get favouriteGuild(): string { return this.localStorage.get(this.guildKey); }
    set favouriteGuild(value: string) { this.localStorage.setOrRemove(this.guildKey, value); }

    private realmKey = "guildRealm";
    get favouriteRealm(): string { return this.localStorage.get(this.realmKey); }
    set favouriteRealm(value: string) { this.localStorage.setOrRemove(this.realmKey, value); }

    private regionKey = "guildRegion";
    get favouriteRegion(): string { return this.localStorage.get(this.regionKey); }
    set favouriteRegion(value: string) { this.localStorage.setOrRemove(this.regionKey, value); }

    favouriteGuildIsSet: boolean;

    ngOnInit() {
        this.guild = this.guild || this.favouriteGuild || "";
        this.realm = this.realm || this.favouriteRealm || "";
        this.region = this.region || this.favouriteRegion || "";
        this.update();

        this.data = [];
        Realms.forEach(x => {
            let category = this.data.find(d => d.name == x.region);
            if (category) {
                category.values.push(x.realm);
            } else {
                this.data.push(new AutoCompleteCategory(x.region, [x.realm]));
            }
        });
    }

    selectRealm(value: AutoCompleteSelectedValue) {
        this.region = value.category;
        this.realm = value.value;
        this.update();
    }

    update() {
        this.favouriteGuildIsSet =
            this.guild == this.favouriteGuild &&
            this.realm == this.favouriteRealm &&
            this.region == this.favouriteRegion &&
            !!this.guild && !!this.realm && !!this.region;
    }

    toggleFavouriteGuild() {
        if (this.favouriteGuildIsSet) {
            this.favouriteGuildIsSet = false;

            this.logger.logGuildFavourite(this.favouriteGuildIsSet, this.favouriteGuild, this.favouriteRealm, this.favouriteRegion);

            this.favouriteGuild = "";
            this.favouriteRealm = "";
            this.favouriteRegion = "";
        } else if (this.canSearch) {
            this.favouriteGuildIsSet = true;

            this.logger.logGuildFavourite(this.favouriteGuildIsSet, this.guild, this.realm, this.region);

            this.favouriteGuild = this.guild;
            this.favouriteRealm = this.realm;
            this.favouriteRegion = this.region;
        }
    }

    get canSearch(): boolean {
        return !!this.clean(this.guild) && !!this.clean(this.realm) && !!this.clean(this.region);
    }

    trySearch() {
        if (this.canSearch) this.searchByGuild();
    }

    searchByGuild() {
        this.router
            .navigate([`/guild/${this.guild}/${this.clean(this.realm)}/${this.clean(this.region)}`])
            .then(success => { if (success) this.logger.logGuildSearch(this.guild, this.realm, this.region); });
    }

    clean(input: string): string {
        if (!input) return "";
        return input.trim().replace(/ /g, "-").replace(/'/g, "").replace(/\(/g, "").replace(/\)/g, "");
    }

}
