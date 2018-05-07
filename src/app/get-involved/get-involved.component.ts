import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'app/shared/logger.service';
import { Page, WipefestService } from 'app/wipefest.service';

@Component({
  selector: 'app-get-involved',
  templateUrl: './get-involved.component.html',
  styleUrls: ['./get-involved.component.scss']
})
export class GetInvolvedComponent implements OnInit {
  constructor(
    private wipefestService: WipefestService,
    private loggerService: LoggerService
  ) {}

  ngOnInit() {
    this.wipefestService.selectPage(Page.GetInvolved);
  }

  logSurveyClick() {
    this.loggerService.logSurveyClick();
  }
}
