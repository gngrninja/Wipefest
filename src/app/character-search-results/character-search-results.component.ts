import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { Parse } from "app/warcraft-logs/parse";
import { ErrorHandler } from "app/errorHandler";
import { WipefestService } from "app/wipefest.service";

@Component({
    selector: 'character-search-results',
    templateUrl: './character-search-results.component.html',
    styleUrls: ['./character-search-results.component.css']
})
export class CharacterSearchResultsComponent implements OnInit {

    character: string;
    realm: string;
    region: string;
    parses: Parse[];

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

        this.warcraftLogsService.getParses(this.character, this.realm, this.region, 11)
            .subscribe(parses => {
                
            }, error => ErrorHandler.GoToErrorPage(error, this.wipefestService, this.router));
    }

}
