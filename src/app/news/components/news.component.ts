import { Component } from '@angular/core';
import { WipefestService, Page } from "app/wipefest.service";
import { LoggerService } from "app/shared/logger.service";
import { NewsService } from "app/news/services/news.service";
import { Article } from "app/news/models/article";

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss']
})
export class NewsComponent {

    article: Article;

    constructor(private wipefestService: WipefestService, private newsService: NewsService, private loggerService: LoggerService) { }

    ngOnInit() {
        this.wipefestService.selectPage(Page.News);
        this.wipefestService.selectReport(null);
        this.wipefestService.selectFight(null);

        this.newsService.getIndex().subscribe(articles => {
            this.article = articles[0];
            this.newsService.getArticleBody(this.article).subscribe(body => {
                this.article.body = body;
            });
        });
    }

}
