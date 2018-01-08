import { Component } from '@angular/core';
import { WipefestService, Page } from "app/wipefest.service";
import { LoggerService } from "app/shared/logger.service";

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss']
})
export class NewsComponent {

    constructor(private wipefestService: WipefestService, private loggerService: LoggerService) { }

    ngOnInit() {
        this.wipefestService.selectPage(Page.News);
        this.wipefestService.selectReport(null);
        this.wipefestService.selectFight(null);
    }

}
