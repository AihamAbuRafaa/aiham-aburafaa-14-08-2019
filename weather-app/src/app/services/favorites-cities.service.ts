import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesCitiesService {
  favoritesCitiesKeys: string[] = [];
  apiKey = "G8KQH0rdzGO80ahVARxzMRUBIWGpByaq";

  constructor() {

  }
  getWeatherOfFav(){
    
  }
  

  addFavCity(key: string) {
    this.favoritesCitiesKeys.push(key)
  }
  removeFavCity(key: string) {
    this.favoritesCitiesKeys=this.favoritesCitiesKeys.filter(i => {
      if(key==i)
      {
        return false;
      }
      return true;
    })
  }
}
