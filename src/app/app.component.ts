import 'intl';
import 'intl/locale-data/jsonp/en';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location, PopStateEvent } from "@angular/common";
import { MarkupParser } from "app/helpers/markup-parser";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    private lastUrl = "";
    private lastPoppedUrl: string;

    constructor(
        private router: Router,
        private location: Location,
        private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) { }

    ngOnInit() {
        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
        this.router.events.subscribe((ev) => {
            if (ev instanceof NavigationEnd) {
                if (ev.url == this.lastPoppedUrl)
                    this.lastPoppedUrl = undefined;
                else if (ev.url.split("?")[0] != this.lastUrl.split("?")[0])
                    window.scrollTo(0, 0);

                this.lastUrl = ev.url;
            }
            
            document.querySelector('body').classList.remove('sidebar-mobile-show');
            document.querySelector('body').classList.remove('aside-menu-mobile-show');
        });
    }

}
