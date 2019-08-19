import { Component, OnInit } from '@angular/core';
import { WeatheCard } from '../day-weather/day-weather.component';
import { FavoritesCitiesService } from 'src/app/services/favorites-cities.service';
import { GeopositionLocationService } from 'src/app/services/geoposition-location.service';
import { cityObj } from 'src/app/services/weather-status.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  weatherCard: WeatheCard = {
    bottom: "Sunny",
    center: '19 F',
    top: "Tel Aviv"
  }
  favoritesCitiesWeather: WeatheCard[] = [];
  constructor(private favoritesSvc: FavoritesCitiesService,
    private geopositonSvc:GeopositionLocationService) {

  }

  async ngOnInit() {
    const favoritesCities = this.favoritesSvc.getFavoriteList();
    favoritesCities.forEach( (value: cityObj, key: string) => {
      this.favoritesCitiesWeather.push({
        center: value.temperature,
        bottom: value.weatherText,
        top: value.cityName,
        cityKey:value.Key
      });
    })
  }

  goToHomePage(city:WeatheCard){
    this.geopositonSvc.city = this.favoritesSvc.getSpecificCity(city.cityKey);
  }

}
