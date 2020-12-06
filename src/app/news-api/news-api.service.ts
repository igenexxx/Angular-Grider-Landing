import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, pluck, switchMap, tap } from 'rxjs/operators';

export interface Article {
  title: string;
  url: string;
  source: {
    name: string;
  }
}

export interface NewsApiResponse {
  totalResults: number;
  articles: Article[]
}

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10;
  private apiKey = '1ef726f5646e4aa2b333e1c34ba1e3bc';
  private country = 'ru'

  private pagesInput: Subject<number>;
  pagesOutput: Observable<Article[]>;
  numberOfPages: Subject<number>

  constructor(private http: HttpClient) {
    this.numberOfPages = new Subject();
    this.pagesInput = new Subject<number>();
    this.pagesOutput = this.pagesInput.asObservable().pipe(
      map(page => {
        return new HttpParams()
          .set('apiKey', this.apiKey)
          .set('country', this.country)
          .set('pageSize', this.pageSize.toString())
          .set('page', page.toString())
      }),
      switchMap(params => this.http.get<NewsApiResponse>(this.url, { params })),
      tap(response => {
        const totalPages = Math.ceil(response.totalResults / this.pageSize);
        this.numberOfPages.next(totalPages);
      }),
      pluck('articles')
    );
  }

  getPage(page: number): void {
    this.pagesInput.next(page);
  }
}
