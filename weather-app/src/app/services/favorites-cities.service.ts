import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesCitiesService {
  favoritesCitiesKeys: string[] = [];
  BASE_URL = environment.baseUrl;
  API_KEY = environment.apiKey;

  constructor() {}

  getWeatherOfFav(){
    
  }
  
  addFavCity(key: string) {
    this.favoritesCitiesKeys.push(key)
  }

  removeFavCity(key: string) {
    this.favoritesCitiesKeys=this.favoritesCitiesKeys.filter(i => {
      return !(key == i);
    })
  }
}
