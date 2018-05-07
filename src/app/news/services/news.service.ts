import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Article } from 'app/news/models/article';
import { LoggerService } from 'app/shared/logger.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class NewsService {
  constructor(private http: Http, private logger: LoggerService) {}

  getIndex(): Observable<Article[]> {
    const url = environment.newsUrl;
    return this.http
      .get(url + 'index.json')
      .map(response => response.json())
      .catch(this.handleError);
  }

  getArticleBody(article: Article): Observable<string> {
    const url = environment.newsUrl;
    return this.http
      .get(url + article.bodySource + '.md')
      .map(response => response.text());
  }

  private handleError(error: Response | any): Observable<Response> {
    this.logger.logErrorResponse(error);

    if (!environment.production) {
      console.error(error);
    }

    return Observable.throw(error);
  }
}
