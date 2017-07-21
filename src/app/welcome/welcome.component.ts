import { Component } from '@angular/core';
import { WipefestService, Page } from "app/wipefest.service";
import { Report } from "app/warcraft-logs/report";

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {

    constructor(private wipefestService: WipefestService) { }

    ngOnInit() {
        this.wipefestService.selectPage(Page.Welcome);
        this.wipefestService.selectReport(null);
        this.wipefestService.selectFight(null);
    }

}
