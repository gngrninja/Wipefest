import { Component } from '@angular/core';
import { Article } from 'app/news/models/article';
import { NewsService } from 'app/news/services/news.service';
import { LoggerService } from 'app/shared/logger.service';
import { Page, WipefestService } from 'app/wipefest.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {
  articles: Article[];

  constructor(
    private wipefestService: WipefestService,
    private newsService: NewsService,
    private loggerService: LoggerService
  ) {}

  ngOnInit() {
    this.wipefestService.selectPage(Page.News);
    this.wipefestService.selectReport(null);
    this.wipefestService.selectFight(null);

    this.newsService.getIndex().subscribe(articles => {
      this.articles = articles.slice(0, 3);
      this.articles.forEach(article => {
        this.newsService.getArticleBody(article).subscribe(body => {
          article.body = body;
        });
      });
    });
  }

  logDiscordClick() {
    this.loggerService.logDiscordClick();
  }

  logDiscordBotClick() {
    this.loggerService.logDiscordBotClick();
  }

  logPatreonClick() {
    this.loggerService.logPatreonClick();
  }
}
