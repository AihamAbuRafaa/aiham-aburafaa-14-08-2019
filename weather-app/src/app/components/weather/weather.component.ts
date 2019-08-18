import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CityAutocompleteService, cityObj } from 'src/app/services/city-autocomplete.service';
import { weatheCard } from '../day-weather/day-weather.component';
import { WeatherStatusService } from 'src/app/services/weather-status.service';
import { GeopositionLocationService } from 'src/app/services/geoposition-location.service';
import { FavoritesCitiesService } from 'src/app/services/favorites-cities.service';
import { Subject, forkJoin } from 'rxjs/index';
import { debounceTime, distinctUntilChanged, switchMap, mergeMap } from 'rxjs/internal/operators'
@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  lat: number;
  lng: number;
  isiInFavorites: boolean = false;
  locationWeather: any[];
  currentWeather: any;
  weatherCard: weatheCard = {
    bottom: "",
    center: '19',
    top: "Mon"
  }
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  city: cityObj;
  comingDaysWeather: weatheCard[] = [];
  seatchTerm$: Subject<string> = new Subject<string>();
  searchCitiesOptions: any[] = [];
  constructor(private autoCompSvc: CityAutocompleteService,
    private weatherSvc: WeatherStatusService,
    private geopositionSvc: GeopositionLocationService,
    private elementRef: ElementRef,
    private favoriteCitiesSvc: FavoritesCitiesService) {
  }

  async  ngOnInit() {
    let position = <Position>await this.getLocation();
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;

    this.geopositionSvc.getLocationByCoord(this.lat, this.lng)
      .pipe(mergeMap(cityKey => forkJoin(this.weatherSvc.get5DaysForecast(cityKey), this.weatherSvc.getcurrentCondition(cityKey))))
      .subscribe(res => {
        this.locationWeather = res[0].DailyForecasts;
        this.currentWeather = res[1]
        this.getDayFromDate();
      })
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "url(../../../assets/blue.png)"
    this.city = this.geopositionSvc.city;

    let ind = this.favoriteCitiesSvc.favoritesCitiesKeys.findIndex(i => i == this.city.Key)
    if (ind == -1)
      this.isiInFavorites = false;
    if (ind > -1)
      this.isiInFavorites = true;

    this.seatchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.autoCompSvc.getCityName(term))).subscribe(data => {
        if (data) {
          this.searchCitiesOptions = data.map(item => {
            return {
              cityName: item.LocalizedName,
              cityKey: item.Key
            }
          })
        }
      });
  }
  getLocation() {
    return new Promise(function (resolve, reject) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position: Position) => {
          if (position) {
            resolve(position);
          }
        },
          (error: PositionError) => console.log(error));
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    })
  }

  getDayFromDate() {
    this.locationWeather.forEach(node => {
      var dateObj = new Date(node.Date);
      let obj: weatheCard = {
        top: this.days[dateObj.getDay()],
        center: node.Day.IconPhrase,
        bottom: node.Temperature.Maximum.Value.toString() + " " + node.Temperature.Maximum.Unit.toString()
      }
      this.comingDaysWeather.push(obj)
    })
    this.comingDaysWeather.splice(0, 1);
  }

  addToFavorite() {
    this.favoriteCitiesSvc.addFavCity(this.city.Key);
    this.isiInFavorites = true;
  }
  removeFromFavorite() {
    this.favoriteCitiesSvc.removeFavCity(this.city.Key);
    this.isiInFavorites = false;
  }

  fahrenheitToCelsius() {
    //C = (5/9) * (F - 32)
  }
  CelsiusTofahrenheit() {
    //C = (5/9) * (F - 32)
  }

  handleTerm(value) {
    this.seatchTerm$.next(value);
  }
}
