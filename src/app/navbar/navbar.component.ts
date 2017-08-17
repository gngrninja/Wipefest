import { Component, OnInit } from '@angular/core';
import { WipefestService, Page } from "app/wipefest.service";

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    page: Page;
    Page = Page;

    isCollapsed = true;

    constructor(private wipefestService: WipefestService) { }

    ngOnInit() {
        this.wipefestService.selectedPage.subscribe(page => this.page = page);
    }

    onMobileLinkClick() {
        this.isCollapsed = true;
        document.querySelector('body').classList.remove('sidebar-mobile-show');
        document.querySelector('body').classList.remove('aside-menu-mobile-show');
    }

}
