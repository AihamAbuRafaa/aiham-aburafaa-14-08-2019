import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherStatusService {
  BASE_URL = environment.baseUrl;
  API_KEY = environment.apiKey;

  fiveDaysForecast: any[];
  currentCondtion: any;

  constructor(private http: HttpClient) { }

  get5DaysForecast(locationKey: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}forecasts/v1/daily/5day/${locationKey}?apikey=${this.API_KEY}`);
  }

  getcurrentCondition(locationKey: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}currentconditions/v1/${locationKey}?apikey=${this.API_KEY}`);
  }

  getcurrentCondtionOfGroup(groupCities: string[]) {

  }
}


