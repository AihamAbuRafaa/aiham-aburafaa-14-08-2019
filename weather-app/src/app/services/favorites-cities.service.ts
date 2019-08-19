  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { environment } from 'src/environments/environment';
  import { Observable } from 'rxjs';
import { cityObj } from './weather-status.service';

  @Injectable({
    providedIn: 'root'
  })
  export class FavoritesCitiesService {
    favoritesCities: cityObj[] = [];

    constructor(private http: HttpClient) { }

    getWeatherOfFav() {
      return this.favoritesCities;
    }

    addFavCity(city: cityObj) {
      this.favoritesCities.push(city)
    }

    removeFavCity(city: cityObj) {
      this.favoritesCities = this.favoritesCities.filter(i => {
        return !(city.Key == i.Key);
      })
    }
  }
