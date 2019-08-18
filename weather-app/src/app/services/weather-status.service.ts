import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherStatusService {
  specificCityUrlWeather = "http://dataservice.accuweather.com/currentconditions/v1" // + /locationkey
  fiveDaysForecasts = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" // + /locationkey
  apiKey = "G8KQH0rdzGO80ahVARxzMRUBIWGpByaq"
  fiveDaysForecast: daysWeatherAlarms[];
  currentCondtion: currentConditions;
  constructor(private http: HttpClient) {
  }
  async get5DaysForecast(locationKey: string) {
    return new Promise(function (resolve) {
      this.http.get("http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + locationKey + "?apikey=" + this.apiKey).subscribe((data) => {
        this.fiveDaysForecast = <daysWeatherAlarms[]>data;
        resolve(this.fiveDaysForecast.DailyForecasts)
      })
    }.bind(this))
  }
  async getcurrentCondition(locationKey: string) {
    return new Promise(function (resolve) {
      this.http.get("http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=" + this.apiKey).subscribe((data) => {
        this.currentCondtion = <currentConditions>data;
        resolve(this.currentCondtion)
      })
    }.bind(this))
  }
  getcurrentCondtionOfGroup(groupCities: string[]) {

  }
}
export interface currentConditions {
  WeatherText: string
  Temperature: {
    Metric: {
      Value: number,
      Unit: string,
    },
    Imperial: {
      Value: number,
      Unit: string,
    }
  }
}
export interface daysWeatherAlarms {
  Day: {
    IconPhrase: string
  }
  Night: {
    IconPhrase: string
  }
  Temperature: {
    Maximum: {
      Value: string
      Unit: string
    }
    Minimum: {
      Value: string
      Unit: string
    }
  }
}

