import { Component, OnInit } from '@angular/core';
import { WipefestService, Page } from "app/wipefest.service";
import { LoggerService } from "app/shared/logger.service";

@Component({
    selector: 'app-discord',
    templateUrl: './discord.component.html',
    styleUrls: ['./discord.component.scss']
})
export class DiscordComponent implements OnInit {

    constructor(
        private wipefestService: WipefestService,
        private loggerService: LoggerService) { }

    ngOnInit() {
        this.wipefestService.selectPage(Page.GetInvolved);
    }

    logDiscordClick() {
        this.loggerService.logDiscordClick();
    }

    logDiscordBotClick() {
        this.loggerService.logDiscordBotClick();
    }

}
