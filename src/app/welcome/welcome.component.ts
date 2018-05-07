import { Component } from '@angular/core';
import { LoggerService } from 'app/shared/logger.service';
import { Page, WipefestService } from 'app/wipefest.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  constructor(
    private wipefestService: WipefestService,
    private loggerService: LoggerService
  ) {}

  ngOnInit() {
    this.wipefestService.selectPage(Page.Welcome);
    this.wipefestService.selectReport(null);
    this.wipefestService.selectFight(null);
  }

  logPatreonClick() {
    this.loggerService.logPatreonClick();
  }
}
