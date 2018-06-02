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
  Page: any = Page;

  isCollapsed: boolean = true;

  constructor(
    private wipefestService: WipefestService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.wipefestService.selectedPage.subscribe(page => (this.page = page));
  }

  onMobileLinkClick(): void {
    this.isCollapsed = true;
  }

  toggleMobileNavigation(): void {
    this.isCollapsed = !this.isCollapsed;
    this.logger.logToggleMobileNavigation(!this.isCollapsed);
  }

  logPatreonClick(): void {
    this.logger.logPatreonClick();
  }
}
