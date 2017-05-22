import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { Report, Fight } from "app/warcraft-logs/report";

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    private reportId: string;
    private selectedReport: Report;
    private selectedFight: Fight;
    
    @Output() whenReportIsSelected: EventEmitter<Report> = new EventEmitter<Report>();
    @Output() whenFightIsSelected: EventEmitter<Fight> = new EventEmitter<Fight>();
    
    constructor(private warcraftLogsService: WarcraftLogsService) {
        this.warcraftLogsService.report.subscribe(report => this.selectedReport = report);
    }

    ngOnInit() {
        this.reportId = "KAVknfHTWv1PrzXR";
        //this.reportId = "WKy1xcRbQvYdnM4m";
        this.selectReport();
    }

    private selectReport() {
        this.warcraftLogsService.getReport(this.reportId)
            .then(() => {
                this.selectedReport.fights = this.selectedReport.fights.filter(x => x.boss == 1866).reverse();
                this.whenReportIsSelected.emit(this.selectedReport);

                this.selectFight(this.selectedReport.fights[0]);
            });
    }

    private selectFight(fight: Fight) {
        this.selectedFight = fight;

        this.whenFightIsSelected.emit(fight);
    }

}
