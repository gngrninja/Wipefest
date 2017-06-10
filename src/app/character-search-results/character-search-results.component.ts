﻿import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { Parse, ParseSpecData } from "app/warcraft-logs/parse";
import { ErrorHandler } from "app/errorHandler";
import { WipefestService } from "app/wipefest.service";
import { Timestamp } from "app/timestamp";

@Component({
    selector: 'character-search-results',
    templateUrl: './character-search-results.component.html',
    styleUrls: ['./character-search-results.component.css']
})
export class CharacterSearchResultsComponent implements OnInit {

    character: string;
    realm: string;
    region: string;
    encounters: Parse[][] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private wipefestService: WipefestService,
        private warcraftLogsService: WarcraftLogsService) { }

    ngOnInit() {
        this.route.params.subscribe((params) => this.handleRoute(params));
    }

    private handleRoute(params: Params) {
        this.character = params["character"];
        this.realm = params["realm"];
        this.region = params["region"];
        this.encounters = [];

        this.warcraftLogsService.getParses(this.character, this.realm, this.region, 11)
            .subscribe(parses => {
                parses.forEach(parse => {
                    if (this.encounters.filter(e => e.some(p => p.name == parse.name)).length == 0) {
                        this.encounters.push([parse]);
                    } else {
                        this.encounters[this.encounters.length - 1].push(parse);
                    }
                });

                this.encounters = this.encounters.map(encounter => {
                    encounter = encounter
                        .filter(x => [3, 4, 5].indexOf(x.difficulty) != -1) // Normal, Heroic, Mythic only
                        .map(parse => {
                            parse.specs = parse.specs.filter(x => x.spec != "Healing" && x.spec != "Melee" && x.spec != "Ranged");
                            return parse;
                        });

                    return encounter;
                });
                this.encounters = this.encounters.reverse();
            },
            error => ErrorHandler.GoToErrorPage(error, this.wipefestService, this.router));
    }

    private difficultyToString(difficulty: number): string {
        switch (difficulty) {
            case 5: return "Mythic";
            case 4: return "Heroic";
            case 3: return "Normal";
            case 2: return "Raid Finder";
            default: return "Unknown";
        }
    }

    private fightTitle(fight: ParseSpecData): string {
        return `${Math.floor(fight.percent)}% (${fight.ilvl}) -  ${Timestamp.ToDayAndMonth(fight.start_time)}`;
    }

}