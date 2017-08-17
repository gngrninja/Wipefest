import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { LocalStorage } from "app/shared/local-storage";

@Component({
    selector: 'character-search',
    templateUrl: './character-search.component.html',
    styleUrls: ['./search.component.css']
})
export class CharacterSearchComponent implements OnInit {

    constructor(private router: Router, private localStorage: LocalStorage) { }

    @Input() character: string;
    @Input() realm: string;
    @Input() region: string;
    favouriteCharacterIsSet: boolean;

    ngOnInit() {
        this.character = this.character || this.localStorage.get("character") || "";
        this.realm = this.realm || this.localStorage.get("characterRealm") || "";
        this.region = this.region || this.localStorage.get("characterRegion") || "";
        this.update();
    }

    update() {
        this.favouriteCharacterIsSet =
            this.character == this.localStorage.get("character") &&
            this.realm == this.localStorage.get("characterRealm") &&
            this.region == this.localStorage.get("characterRegion") &&
            !!this.character && !!this.realm && !!this.region;
    }

    toggleFavouriteCharacter() {
        if (this.favouriteCharacterIsSet) {
            this.localStorage.remove("character");
            this.localStorage.remove("characterRealm");
            this.localStorage.remove("characterRegion");

            this.favouriteCharacterIsSet = false;
        } else {
            this.localStorage.set("character", this.character);
            this.localStorage.set("characterRealm", this.realm);
            this.localStorage.set("characterRegion", this.region);

            this.favouriteCharacterIsSet = true;
        }
    }

    searchByCharacter() {
        if (this.clean(this.character) && this.clean(this.realm) && this.clean(this.region)) {
            this.router.navigate([`/character/${this.clean(this.character)}/${this.clean(this.realm)}/${this.clean(this.region)}`]);
        }
    }

    clean(input: string): string {
        if (!input) return "";
        return input.trim().replace(/ /g, "-").replace(/'/g, "");
    }

}
