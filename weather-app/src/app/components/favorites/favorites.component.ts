import { Component, OnInit } from '@angular/core';
import { weatheCard } from '../day-weather/day-weather.component';
import { FavoritesCitiesService } from 'src/app/services/favorites-cities.service';
import { GeopositionLocationService } from 'src/app/services/geoposition-location.service';
import { cityObj } from 'src/app/services/weather-status.service';

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
  favoritesCities: cityObj[] = [];
  favoritesCitiesWeather: weatheCard[] = [];
  constructor(private favoritesSvc: FavoritesCitiesService,
    private geopositonSvc:GeopositionLocationService) {

  }

  async ngOnInit() {
    this.favoritesCities = this.favoritesSvc.favoritesCities;
    this.favoritesCitiesWeather=this.favoritesCities.map(i=>{
      return{
        center:i.temperature,
        bottom:i.weatherText,
        top:i.cityName
      }
    })
  }
  goToHomePage(index:number){
    this.geopositonSvc.city=this.favoritesCities[index];
  }

}
