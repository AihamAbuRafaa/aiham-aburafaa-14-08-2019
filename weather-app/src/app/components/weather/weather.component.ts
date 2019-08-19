import { FormControl } from '@angular/forms';
import { CityAutocompleteService } from 'src/app/services/city-autocomplete.service';
import { GeopositionLocationService } from 'src/app/services/geoposition-location.service';
import { FavoritesCitiesService } from 'src/app/services/favorites-cities.service';
import { Subject, forkJoin, Observable } from 'rxjs/index';
import { debounceTime, distinctUntilChanged, switchMap, mergeMap } from 'rxjs/internal/operators'
import { OnInit, Component, ElementRef } from '@angular/core';
import { cityObj, WeatherStatusService } from 'src/app/services/weather-status.service';
import { WeatheCard } from '../day-weather/day-weather.component';
@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  myControl = new FormControl();
  lat: number;
  lng: number;

  locationWeather: any[];
  currentWeather: any;
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  city: cityObj = {
    Key: "",
    cityName: "",
    temperature: "",
    weatherText: ""
  };
  comingDaysWeather: WeatheCard[] = [];
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
      this.getLocation().subscribe(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        this.geopositionSvc.getLocationByCoord(this.lat, this.lng)
          .pipe(
            mergeMap(cityKey => forkJoin(this.weatherSvc.get5DaysForecast(cityKey.Key), this.weatherSvc.getcurrentCondition(cityKey.Key)))
          )
          .subscribe(res => {
            if (res && res[0] && res[1]) {
              this.locationWeather = res[0].DailyForecasts;
              this.currentWeather = res[1];
              this.getDayFromDate();

              this.city = this.geopositionSvc.city;
              this.city.temperature = `${this.currentWeather[0].Temperature.Imperial.Value}
              ${this.currentWeather[0].Temperature.Imperial.Unit}`;
              this.city.weatherText = this.currentWeather[0].WeatherText;
            }
          });
      });
    } else {
      this.selectCity(this.geopositionSvc.city.Key);
    }

    this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = 'url(../../../assets/blue.png)';

    this.seatchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.autoCompSvc.getCityName(term))).subscribe(data => {
        if (data) {
          this.searchCitiesOptions = data.map(item => {
            return {
              cityName: item.LocalizedName,
              cityKey: item.Key
            };
          });
        }
      });
  }

  getDayFromDate() {
    this.comingDaysWeather = [];
    this.locationWeather.forEach(node => {
      let dateObj = new Date(node.Date);
      let obj: WeatheCard = {
        top: this.days[dateObj.getDay()],
        center: node.Day.IconPhrase,
        bottom: node.Temperature.Maximum.Value.toString() + " " + node.Temperature.Maximum.Unit.toString()
      }
      this.comingDaysWeather.push(obj);
    })
    this.comingDaysWeather.splice(0, 1);
  }

  selectCity(cityKey: string, flag = true) {
    forkJoin(this.weatherSvc.get5DaysForecast(cityKey), this.weatherSvc.getcurrentCondition(cityKey))
      .subscribe(res => {
        this.locationWeather = res[0].DailyForecasts;
        this.currentWeather = res[1];
        this.getDayFromDate();
        if (flag === true)
          this.city = this.geopositionSvc.city
        else {
          this.city.Key = cityKey;
          this.city.cityName = this.searchCitiesOptions.find(i => i.cityKey == cityKey).cityName;
          this.city.temperature = this.currentWeather[0].Temperature.Imperial.Value + " " + this.currentWeather[0].Temperature.Imperial.Unit;
          this.city.weatherText = this.currentWeather[0].WeatherText;
        }
      })
  }

  getLocation(): Observable<any> {
    return Observable.create(observer => {
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => observer.error(error)
        );
      } else {
        observer.error('Geolocation is not supported by this browser.');
      }
    });
  }

  addToFavorite() {
    let a: cityObj = {
      Key: this.city.Key,
      cityName: this.city.cityName,
      temperature: this.city.temperature,
      weatherText: this.city.weatherText
    }
    this.favoriteCitiesSvc.addFavCity(a);
  }

  removeFromFavorite() {
    this.favoriteCitiesSvc.removeFavCity(this.city.Key);
  }

  isInFavorites(cityKey: string): boolean {
    return this.favoriteCitiesSvc.hasCityOnFavorite(cityKey);
  }

  handleTerm(value) {
    this.seatchTerm$.next(value);
  }
}