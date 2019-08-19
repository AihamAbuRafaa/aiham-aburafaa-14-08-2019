  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
import { cityObj } from './weather-status.service';

  @Injectable({
    providedIn: 'root'
  })
  export class FavoritesCitiesService {
    favoritesCities: cityObj[] = [];

    constructor(private http: HttpClient) { }


    addFavCity(city: cityObj) {
      this.favoritesCities.push(city)
    }

    removeFavCity(key: string) {
        this.favoritesCities = this.favoritesCities.filter(i => {
          return !(key == i.Key);
        })
    }
  }
