import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cityObj } from './city-autocomplete.service';

@Injectable({
  providedIn: 'root'
})
export class GeopositionLocationService {
  apiKey = "G8KQH0rdzGO80ahVARxzMRUBIWGpByaq";
  autoCompleteUrl = "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search";
  city: cityObj;
  constructor(private http: HttpClient) {
  }
  getLocationByCoord(lat: number, lng: number) {
    return new Promise(function (resolve) {
      this.http.get(this.autoCompleteUrl + "?" + "apikey=" + this.apiKey + "&q=" + lat + "," + lng).subscribe((data) => {
        this.city = <cityObj>data;
        resolve(this.city.Key);
      })
    }.bind(this))
  }
}
