import { Component } from '@angular/core';
import { Report, Fight } from "./warcraft-logs/report";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    
    private selectedReport: Report;
    private selectedFight: Fight;

    constructor() { }

    private selectReport(report: Report) {
        this.selectedReport = report;
    }

    private selectFight(fight: Fight) {
        this.selectedFight = fight;
    }
    
}
