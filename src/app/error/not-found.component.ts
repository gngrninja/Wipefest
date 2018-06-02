import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'app/shared/logger.service';

@Component({
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.logNotFound();
  }
}
