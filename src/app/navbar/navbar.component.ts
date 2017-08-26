import { Component, OnInit } from '@angular/core';
import { WipefestService, Page } from "app/wipefest.service";
import { LoggerService } from "app/shared/logger.service";

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    page: Page;
    Page = Page;

    isCollapsed = true;

    constructor(private wipefestService: WipefestService, private logger: LoggerService) { }

    ngOnInit() {
        this.wipefestService.selectedPage.subscribe(page => this.page = page);
    }

    onMobileLinkClick() {
        this.isCollapsed = true;
    }

    toggleMobileNavigation() {
        this.isCollapsed = !this.isCollapsed;
        this.logger.logToggleMobileNavigation(!this.isCollapsed);
    }

}
