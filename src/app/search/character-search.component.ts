import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AutoCompleteCategory,
  AutoCompleteSelectedValue
} from 'app/shared/autocomplete/auto-complete.component';
import { LocalStorage } from 'app/shared/local-storage';
import { LoggerService } from 'app/shared/logger.service';
import { Realms } from 'app/shared/realms';

@Component({
  selector: 'character-search',
  templateUrl: './character-search.component.html',
  styleUrls: ['./search.component.css']
})
export class CharacterSearchComponent implements OnInit {
  data = [];

  constructor(
    private router: Router,
    private localStorage: LocalStorage,
    private logger: LoggerService
  ) {}

  @Input() character: string;
  @Input() realm: string;
  @Input() region: string;

  private characterKey = 'character';
  get favouriteCharacter(): string {
    return this.localStorage.get(this.characterKey);
  }
  set favouriteCharacter(value: string) {
    this.localStorage.setOrRemove(this.characterKey, value);
  }

  private realmKey = 'characterRealm';
  get favouriteRealm(): string {
    return this.localStorage.get(this.realmKey);
  }
  set favouriteRealm(value: string) {
    this.localStorage.setOrRemove(this.realmKey, value);
  }

  private regionKey = 'characterRegion';
  get favouriteRegion(): string {
    return this.localStorage.get(this.regionKey);
  }
  set favouriteRegion(value: string) {
    this.localStorage.setOrRemove(this.regionKey, value);
  }

  favouriteCharacterIsSet: boolean;

  ngOnInit() {
    this.character = this.character || this.favouriteCharacter || '';
    this.realm = this.realm || this.favouriteRealm || '';
    this.region = this.region || this.favouriteRegion || '';
    this.update();

    this.data = [];
    Realms.forEach(x => {
      const category = this.data.find(d => d.name == x.region);
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
    this.favouriteCharacterIsSet =
      this.character == this.favouriteCharacter &&
      this.realm == this.favouriteRealm &&
      this.region == this.favouriteRegion &&
      !!this.character &&
      !!this.realm &&
      !!this.region;
  }

  toggleFavouriteCharacter() {
    if (this.favouriteCharacterIsSet) {
      this.favouriteCharacterIsSet = false;

      this.logger.logCharacterFavourite(
        this.favouriteCharacterIsSet,
        this.favouriteCharacter,
        this.favouriteRealm,
        this.favouriteRegion
      );

      this.favouriteCharacter = '';
      this.favouriteRealm = '';
      this.favouriteRegion = '';
    } else if (this.canSearch) {
      this.favouriteCharacterIsSet = true;

      this.logger.logCharacterFavourite(
        this.favouriteCharacterIsSet,
        this.character,
        this.realm,
        this.region
      );

      this.favouriteCharacter = this.character;
      this.favouriteRealm = this.realm;
      this.favouriteRegion = this.region;
    }
  }

  get canSearch(): boolean {
    return (
      !!this.clean(this.character) &&
      !!this.clean(this.realm) &&
      !!this.clean(this.region)
    );
  }

  trySearch() {
    if (this.canSearch) {
      this.searchByCharacter();
    }
  }

  searchByCharacter() {
    this.router
      .navigate([
        `/character/${this.clean(this.character)}/${this.clean(
          this.realm
        )}/${this.clean(this.region)}`
      ])
      .then(success => {
        if (success) {
          this.logger.logCharacterSearch(
            this.character,
            this.realm,
            this.region
          );
        }
      });
  }

  clean(input: string): string {
    if (!input) {
      return '';
    }
    return input
      .trim()
      .replace(/ /g, '-')
      .replace(/'/g, '')
      .replace(/\(/g, '')
      .replace(/\)/g, '');
  }
}
