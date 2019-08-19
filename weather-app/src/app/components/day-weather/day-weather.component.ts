import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-day-weather',
  templateUrl: './day-weather.component.html',
  styleUrls: ['./day-weather.component.scss']
})
export class DayWeatherComponent implements OnInit {
  @Input() weatherCard: WeatheCard;
  constructor() { }

  ngOnInit() {
    if (!this.weatherCard.bottom)
      this.weatherCard.bottom = ""
  }

}
export interface WeatheCard {
  top: string;
  center: string;
  bottom?: string;
  cityKey?:string;
}