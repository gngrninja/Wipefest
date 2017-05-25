import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Report, Fight } from "app/warcraft-logs/report";
import { Router } from "@angular/router";
import { WipefestService } from "app/wipefest.service";

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    private reportId: string;
    private report: Report;
    private selectedFight: Fight;
    
    constructor(
        private router: Router,
        private wipefestService: WipefestService) { }

    ngOnInit() {
        this.wipefestService.selectedReport.subscribe(report => {
            this.report = report;
            if (this.report) {
                this.reportId = this.report.id;
            } else {
                this.reportId = "";
            }
        });
        this.wipefestService.selectedFight.subscribe(fight => this.selectedFight = fight);
    }

    private selectFight(fight: Fight) {
        this.selectedFight = fight;
    }
}
