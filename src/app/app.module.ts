import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { NewsApiModule } from './news-api/news-api.module';
import {WeatherModule} from './weather/weather.module';
import {NotificationsModule} from './notifications/notifications.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WeatherModule,
    HttpClientModule,
    NotificationsModule,
    NewsApiModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
