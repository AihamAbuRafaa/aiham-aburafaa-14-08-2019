import { Component, OnInit } from '@angular/core';
import { weatheCard } from '../day-weather/day-weather.component';
import { FavoritesCitiesService } from 'src/app/services/favorites-cities.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  weatherCard: weatheCard = {
    bottom: "Sunny",
    center: '19 F', 
    top: "Tel Aviv"
  }
  constructor(private favoritesSvc: FavoritesCitiesService) {

  }

  async ngOnInit() {
    let a = await this.favoritesSvc.getWeatherOfFav();
  }

}
