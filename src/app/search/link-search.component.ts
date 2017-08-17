import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
    selector: 'link-search',
    templateUrl: './link-search.component.html'
})
export class LinkSearchComponent {

    constructor(private router: Router) { }

    warcraftLogsLink = "";
    warcraftLogsLinkError = "";

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
        if (!input) return "";
        return input.trim().replace(/ /g, "-").replace(/'/g, "");
    }

}
