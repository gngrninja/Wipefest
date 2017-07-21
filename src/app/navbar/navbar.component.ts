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

    constructor(private wipefestService: WipefestService) { }

    ngOnInit() {
        this.wipefestService.selectedPage.subscribe(page => this.page = page);
    }

}
