import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map, mergeMap, pluck, retry, share, switchMap, tap, toArray } from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {fromArray} from 'rxjs/internal/observable/fromArray';
import { NotificationsService } from '../notifications/notifications.service';

interface OpenWeatherResponse {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    }
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  private ApiUrl = 'https://api.openweathermap.org/data/2.5/forecast'
  private dayStartPosition = 8;

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService
  ) { }

  getForecast() {
    return this.getCurrentLocation().pipe(
      map(coords =>
        new HttpParams()
          .set('lat', coords.latitude.toString())
          .set('lon', coords.longitude.toString())
          .set('units', 'metric')
          .set('appid', 'ae4dd872013e795a207427574202e5d4')
      ),
      switchMap(params => this.http.get<OpenWeatherResponse>(this.ApiUrl, { params })),
      pluck('list'),
      mergeMap(list => fromArray(list)),
      filter((value, index) => index % this.dayStartPosition === 0),
      map(value => ({
        dateString: value.dt_txt,
        temperature: value.main.temp,
      })),
      toArray(),
      share()
    )
  }

  getCurrentLocation(): Observable<Coordinates> {
    return new Observable<Coordinates>(observer => {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          observer.next(position.coords);
          observer.complete();
        },
        err => observer.error(err)
      )
    }).pipe(
      retry(1),
      tap(
        () => this.notificationsService.addSuccess('Got your location')
      ),
      catchError(err => {
        // #1 - Handle the error
        this.notificationsService.addError('Failed to get your location');
        // #2 - Return new observable
        return throwError(err);
      })
    )
  }
}
