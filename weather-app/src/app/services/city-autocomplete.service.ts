import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CityAutocompleteService {
  apiKey = "G8KQH0rdzGO80ahVARxzMRUBIWGpByaq";
  autoCompleteUrl = "http://dataservice.accuweather.com/locations/v1/cities/autocomplete";
  city: cityObj;
  constructor(private http: HttpClient) {
  }
  async getCity(cityName: string) {
    await this.http.get("http://dataservice.accuweather.com/locations/v1/cities/autocomplete" + "?" + "apikey=" + this.apiKey + "&q=" + cityName).subscribe((data) => {
      this.city = <cityObj>data;
    })
  }
}
export interface cityObj {
  LocalizedName: string
  Key: string
}
