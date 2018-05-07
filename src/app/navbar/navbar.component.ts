import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'app/shared/logger.service';
import { Page, WipefestService } from 'app/wipefest.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  page: Page;
  Page = Page;

  isCollapsed = true;

  constructor(
    private wipefestService: WipefestService,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    this.wipefestService.selectedPage.subscribe(page => (this.page = page));
  }

  onMobileLinkClick() {
    this.isCollapsed = true;
  }

  toggleMobileNavigation() {
    this.isCollapsed = !this.isCollapsed;
    this.logger.logToggleMobileNavigation(!this.isCollapsed);
  }

  logPatreonClick() {
    this.logger.logPatreonClick();
  }
}
