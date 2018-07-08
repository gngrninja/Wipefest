import { Location, PopStateEvent } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { MarkdownService } from 'ngx-md';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private lastUrl = '';
  private lastPoppedUrl: string;

  constructor(
    private router: Router,
    private location: Location,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private markdownService: MarkdownService
  ) {}

  ngOnInit(): void {
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        if (ev.url === this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
        } else if (ev.url.split('?')[0] !== this.lastUrl.split('?')[0]) {
          window.scrollTo(0, 0);
        }

        this.lastUrl = ev.url;
      }

      document.querySelector('body').classList.remove('sidebar-mobile-show');
      document.querySelector('body').classList.remove('aside-menu-mobile-show');
    });

    this.markdownService.renderer.image = (href, title, text) => {
      const attributes = ['class="markdown-img"', `src="${href}"`];
      if (text && text.length) {
        attributes.push(`alt="${text}"`);
      }
      if (title && title.length) {
        attributes.push(`title="${title}"`);
      }
      return `<img ${attributes.join(' ')} />`;
    };
  }
}
