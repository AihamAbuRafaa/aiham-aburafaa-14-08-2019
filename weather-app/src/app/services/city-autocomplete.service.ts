import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CityAutocompleteService {
  BASE_URL = environment.baseUrl;
  API_KEY = environment.apiKey;

  constructor(private http: HttpClient) {}

  getCityName(cityName: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}locations/v1/cities/autocomplete?apikey=${this.API_KEY}&q=${cityName}`)
      .pipe(map(data => data));
  }
}
