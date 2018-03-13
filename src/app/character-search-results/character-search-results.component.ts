import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { WipefestService, Page } from "app/wipefest.service";
import { Timestamp } from "app/helpers/timestamp-helper";
import { Difficulty } from "app/helpers/difficulty-helper";
import { DomSanitizer } from "@angular/platform-browser";
import { LocalStorage } from "app/shared/local-storage";
import { LoggerService } from "app/shared/logger.service";

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
        new Zone("Tomb of Sargeras", "sargeras", 13, [1, 2, 3]),
        new Zone("Antorus, the Burning Throne", "antorus", 17, [1])
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
        private warcraftLogsService: WarcraftLogsService,
        private domSanitizer: DomSanitizer,
        private localStorage: LocalStorage,
        private logger: LoggerService) { }

    ngOnInit() {
        this.wipefestService.selectPage(Page.CharacterSearchResults);
        this.route.params.subscribe((params) => this.handleRoute(params));
    }

    private handleRoute(params: Params) {
        this.loading = true;

        this.character = params["character"] || this.localStorage.get("character");
        this.realm = params["realm"] || this.localStorage.get("characterRealm");
        this.region = params["region"] || this.localStorage.get("characterRegion");
        this.selectedZone = this.zones.find(x => x.slug == params["zone"]) || this.zones[1];
        this.encounters = [];

        if (!this.character || !this.realm || !this.region) {
            this.loading = false;
            return;
        }

        this.warcraftLogsService.getParses(this.character, this.realm, this.region, this.selectedZone.id, this.selectedZone.partitions)
            .subscribe(parses => {
                this.loading = false;
                this.error = null;
                parses.forEach(parse => {
                    if (![3, 4, 5].some(x => x == parse.difficulty)) { // Normal, Heroic, Mythic
                        return;
                    }

                    if (!this.encounters.some(x => x.name == parse.name)) {
                        this.encounters.push(new CharacterSearchResultEncounter(parse.name));
                    }

                    let encounter = this.encounters.find(x => x.name == parse.name);
                    if (!encounter.difficulties.some(x => x.difficulty == parse.difficulty)) {
                        encounter.difficulties.push(new CharacterSearchResultDifficulty(parse.difficulty));
                    }

                    let difficulty = encounter.difficulties.find(x => x.difficulty == parse.difficulty);
                    parse.specs.forEach(spec => {
                        difficulty.fights = difficulty.fights.concat(spec.data.map(
                            fight => new CharacterSearchResultFight(
                                fight.start_time,
                                spec.class,
                                spec.spec,
                                fight.historical_percent,
                                fight.ilvl,
                                fight.report_code,
                                fight.report_fight)))
                            .filter(x => !["Healing", "Melee", "Ranged"].some(y => y == x.spec))
                            .sort((a, b) => b.timestamp - a.timestamp);
                    });
                });
            },
            error => {
                this.error = error;
                this.loading = false;
                this.encounters = [];
            });
    }

    encounterImage(encounterName: string) {
        let id = this.warcraftLogsService.getEncounters().find(x => x.name == encounterName).id;
        return this.domSanitizer.bypassSecurityTrustStyle(`url('http://warcraftlogs.com/img/bosses/${id}-execution.png')`);
    }

    rankingQuality(percent: number) {
        return percent == 100 ? 'artifact' :
            percent >= 95 ? 'legendary' :
                percent >= 75 ? 'epic' :
                    percent >= 50 ? 'rare' :
                        percent >= 25 ? 'uncommon' :
                            'common';
    }

}

export class CharacterSearchResultEncounter {

    difficulties: CharacterSearchResultDifficulty[] = [];

    constructor(public name: string) { }

}

export class CharacterSearchResultDifficulty {

    fights: CharacterSearchResultFight[] = [];

    constructor(public difficulty: number) { }

}

export class CharacterSearchResultFight {

    constructor(public timestamp: number,
        public className: string,
        public spec: string,
        public percent: number,
        public itemLevel: number,
        public reportId: string,
        public fightId: number) { }

}

export class Zone {

    constructor(public title: string, public slug: string, public id: number, public partitions: number[]) { }

}
