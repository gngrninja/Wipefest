import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'app/shared/logger.service';
import { Page, WipefestService } from 'app/wipefest.service';

@Component({
  selector: 'app-discord',
  templateUrl: './discord.component.html',
  styleUrls: ['./discord.component.scss']
})
export class DiscordComponent implements OnInit {
  constructor(
    private wipefestService: WipefestService,
    private loggerService: LoggerService
  ) {}

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
