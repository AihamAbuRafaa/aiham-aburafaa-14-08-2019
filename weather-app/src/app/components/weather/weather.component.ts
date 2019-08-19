import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CityAutocompleteService } from 'src/app/services/city-autocomplete.service';
import { weatheCard } from '../day-weather/day-weather.component';
import { WeatherStatusService, cityObj } from 'src/app/services/weather-status.service';
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
  lat: number;
  lng: number;
  isiInFavorites: boolean = false;
  locationWeather: any[];
  currentWeather: any;
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  city: cityObj = {
    Key: "",
    cityName: "",
    temperature: "",
    weatherText: ""
  };
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
    if (!this.geopositionSvc.city) {
      let position = <Position>await this.getLocation();
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;

      this.geopositionSvc.getLocationByCoord(this.lat, this.lng)
        .pipe(mergeMap(cityKey => forkJoin(this.weatherSvc.get5DaysForecast(cityKey.Key), this.weatherSvc.getcurrentCondition(cityKey.Key))))
        .subscribe(res => {
          this.locationWeather = res[0].DailyForecasts;
          this.currentWeather = res[1];
          this.getDayFromDate();
          this.city = this.geopositionSvc.city;
          this.city.temperature = this.currentWeather[0].Temperature.Imperial.Value + " " + this.currentWeather[0].Temperature.Imperial.Unit;
          this.city.weatherText = this.currentWeather[0].WeatherText;
          this.findinFavorites()
        })
    } else {
      this.selectCity(this.geopositionSvc.city.Key)
    }
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "url(../../../assets/blue.png)"

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
    this.comingDaysWeather = [];
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
    let a = {
      Key: this.city.Key,
      cityName: this.city.cityName,
      temperature: this.city.temperature,
      weatherText: this.city.weatherText
    }// i did this because i want to  pass the object byvalue
    this.favoriteCitiesSvc.addFavCity(a);
    this.isiInFavorites = true;
  }
  removeFromFavorite() {
    let a = {
      Key: this.city.Key,
      cityName: this.city.cityName,
      temperature: this.city.temperature,
      weatherText: this.city.weatherText
    }// i did this because i want to  pass the object byvalue
    this.favoriteCitiesSvc.removeFavCity(a);
    this.isiInFavorites = false;
  }

  selectCity(cityKey: string, flag = true) {
    forkJoin(this.weatherSvc.get5DaysForecast(cityKey), this.weatherSvc.getcurrentCondition(cityKey))
      .subscribe(res => {
        this.locationWeather = res[0].DailyForecasts;
        this.currentWeather = res[1];
        this.getDayFromDate();
        if (flag == true)
          this.city = this.geopositionSvc.city
        else {
          this.city.Key = cityKey;
          this.city.cityName = this.searchCitiesOptions.find(i => i.cityKey == cityKey).cityName;
          this.city.temperature = this.currentWeather[0].Temperature.Imperial.Value + " " + this.currentWeather[0].Temperature.Imperial.Unit;
          this.city.weatherText = this.currentWeather[0].WeatherText;
        }
        this.findinFavorites()
      })


  }

  findinFavorites() {
    let ind = this.favoriteCitiesSvc.favoritesCities.findIndex(i => i.Key == this.city.Key)
    if (ind == -1)
      this.isiInFavorites = false;
    if (ind > -1)
      this.isiInFavorites = true;
  }

  handleTerm(value) {
    this.seatchTerm$.next(value);
  }
}

