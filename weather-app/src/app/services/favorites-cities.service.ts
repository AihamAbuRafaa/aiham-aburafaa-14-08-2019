import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cityObj } from './weather-status.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesCitiesService {
  private favoritesCities: Map<string, cityObj> = new Map<string, cityObj>();
  constructor(private http: HttpClient) { }

  getFavoriteList() {
    return this.favoritesCities;
  }

  addFavCity(city: cityObj) {
    if(!city || !city.Key) { return; }
    this.favoritesCities.set(city.Key, city);
  }

  removeFavCity(cityKey: string): void {
    if(!cityKey) { return; }
    this.favoritesCities.delete(cityKey);
  }

  getSpecificCity(cityKey: string): cityObj {
    if(!cityKey) { return; }
    return this.favoritesCities.get(cityKey);
  }

  hasCityOnFavorite(cityKey: string): boolean {
    if(!cityKey) { return false; }
    return this.favoritesCities.has(cityKey);
  }
}