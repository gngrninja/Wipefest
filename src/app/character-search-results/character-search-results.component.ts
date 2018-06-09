import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Difficulty } from 'app/helpers/difficulty-helper';
import { Timestamp } from 'app/helpers/timestamp-helper';
import { LocalStorage } from 'app/shared/local-storage';
import { LoggerService } from 'app/shared/logger.service';
import { Page, WipefestService } from 'app/wipefest.service';
import { WipefestAPI } from '@wipefest/api-sdk';
import { ParseDto } from '@wipefest/api-sdk/dist/lib/models';
import { EncountersService } from '@wipefest/core';

@Component({
  selector: 'character-search-results',
  templateUrl: './character-search-results.component.html',
  styleUrls: ['./character-search-results.component.scss']
})
export class CharacterSearchResultsComponent implements OnInit {
  loading = true;

  character: string;
  realm: string;
  region: string;

  zones: Zone[] = [
    new Zone('Tomb of Sargeras', 'sargeras', 13, [1, 2, 3]),
    new Zone('Antorus, the Burning Throne', 'antorus', 17, [1])
  ];
  selectedZone: Zone;
  encounters: CharacterSearchResultEncounter[] = [];

  error: any;

  Difficulty = Difficulty;
  Timestamp = Timestamp;
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wipefestService: WipefestService,
    private wipefestApi: WipefestAPI,
    private encountersService: EncountersService,
    private domSanitizer: DomSanitizer,
    private localStorage: LocalStorage,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.wipefestService.selectPage(Page.CharacterSearchResults);
    this.route.params.subscribe(params => this.handleRoute(params));
  }

  encounterImage(encounterName: string): SafeStyle {
    const encounter = this.encountersService
      .getEncounters()
      .find(x => x.name === encounterName);
    if (encounter === undefined) {
      return this.domSanitizer.bypassSecurityTrustStyle(`url('')`);
    }

    return this.domSanitizer.bypassSecurityTrustStyle(
      `url('http://warcraftlogs.com/img/bosses/${encounter.id}-execution.png')`
    );
  }

  rankingQuality(percent: number): string {
    return percent === 100
      ? 'artifact'
      : percent >= 95
        ? 'legendary'
        : percent >= 75
          ? 'epic'
          : percent >= 50
            ? 'rare'
            : percent >= 25
              ? 'uncommon'
              : 'common';
  }

  private handleRoute(params: Params): void {
    this.loading = true;

    this.character = params.character || this.localStorage.get('character');
    this.realm = params.realm || this.localStorage.get('characterRealm');
    this.region = params.region || this.localStorage.get('characterRegion');
    this.selectedZone =
      this.zones.find(x => x.slug == params.zone) || this.zones[1];
    this.encounters = [];

    if (!this.character || !this.realm || !this.region) {
      this.loading = false;
      return;
    }

    this.wipefestApi
      .getCharacterParses(this.region, this.realm, this.character, {
        zone: this.selectedZone.id,
        partitions: this.selectedZone.partitions
      })
      .then(
        parses => {
          this.loading = false;
          this.error = null;

          parses.forEach(parse => {
            if (![3, 4, 5].some(x => x === parse.difficulty)) {
              // Normal, Heroic, Mythic
              return;
            }

            if (!this.encounters.some(x => x.name === parse.name)) {
              this.encounters.push(
                new CharacterSearchResultEncounter(parse.name)
              );
            }

            const encounter = this.encounters.find(x => x.name === parse.name);
            if (
              !encounter.difficulties.some(
                x => x.difficulty === parse.difficulty
              )
            ) {
              encounter.difficulties.push(
                new CharacterSearchResultDifficulty(parse.difficulty)
              );
            }

            const difficulty = encounter.difficulties.find(
              x => x.difficulty === parse.difficulty
            );
            parse.specializations.forEach(spec => {
              difficulty.fights = difficulty.fights
                .concat(
                  spec.data.map(
                    fight =>
                      new CharacterSearchResultFight(
                        fight.startTime,
                        spec.classProperty,
                        spec.specialization,
                        fight.historicalPercent,
                        fight.itemLevel,
                        fight.reportId,
                        fight.fightId
                      )
                  )
                )
                .filter(
                  x => !['Healing', 'Melee', 'Ranged'].some(y => y === x.spec)
                )
                .sort((a, b) => b.timestamp - a.timestamp);
            });
          });
        },
        error => {
          this.error = error;
          this.loading = false;
          this.encounters = [];
        }
      );
  }
}

export class CharacterSearchResultEncounter {
  difficulties: CharacterSearchResultDifficulty[] = [];

  constructor(public name: string) {}
}

export class CharacterSearchResultDifficulty {
  fights: CharacterSearchResultFight[] = [];

  constructor(public difficulty: number) {}
}

export class CharacterSearchResultFight {
  constructor(
    public timestamp: number,
    public className: string,
    public spec: string,
    public percent: number,
    public itemLevel: number,
    public reportId: string,
    public fightId: number
  ) {}
}

export class Zone {
  constructor(
    public title: string,
    public slug: string,
    public id: number,
    public partitions: number[]
  ) {}
}
