import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { EventConfig, EventConfigIndex } from "app/event-config/event-config";
import { Http, Response } from "@angular/http";
import { CombatEvent } from "app/warcraft-logs/combat-event";
import { Report, Fight } from "app/warcraft-logs/report";
import { environment } from "environments/environment";
import { LoggerService } from "app/shared/logger.service";
import { WarcraftLogsService } from "app/warcraft-logs/warcraft-logs.service";
import { Article } from "app/news/models/article";

@Injectable()
export class NewsService {

    constructor(private http: Http, private logger: LoggerService) { }

    getIndex(): Observable<Article[]> {
        let url = environment.newsUrl;
        return this.http
            .get(url + "index.json")
            .map(response => response.json())
            .catch(this.handleError);
    }

    getArticleBody(article: Article): Observable<string> {
        let url = environment.newsUrl;
        return this.http
            .get(url + article.bodySource + ".md")
            .map(response => response.text())
            .catch(this.handleError);
    }

    private handleError(error: Response | any): Observable<Response> {
        this.logger.logErrorResponse(error);

        if (!environment.production) {
            console.error(error);
        }

        return Observable.throw(error);
    }

}
