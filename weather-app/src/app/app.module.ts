import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './router/app-routing.module';
import { AppComponent } from './app.component';
import { MatSelectModule, MatInputModule} from '@angular/material';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import {MatIconModule} from '@angular/material/icon';
import { WeatherComponent } from './components/weather/weather.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { DayWeatherComponent } from './components/day-weather/day-weather.component';
import { CityAutocompleteService } from './services/city-autocomplete.service';
import { FavoritesCitiesService } from './services/favorites-cities.service';
import { WeatherStatusService } from './services/weather-status.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';




@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    FavoritesComponent,
    DayWeatherComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatSelectModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatIconModule,
    HttpClientModule,
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [
    CityAutocompleteService,
    FavoritesCitiesService,
    WeatherStatusService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }