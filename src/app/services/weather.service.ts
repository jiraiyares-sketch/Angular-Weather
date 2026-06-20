import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiKey = 'd60ec074697233851ab83c79a188a61e';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) {}

  // 🌤️ Clima por cidade
  getWeather(city: string) {
    return this.http.get(
      `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=pt_br`
    );
  }

  // 📅 Previsão por cidade
  getForecast(city: string) {
    return this.http.get(
      `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric&lang=pt_br`
    );
  }

  // 📍 Clima por GPS
  getWeatherByCoords(lat: number, lon: number) {
    return this.http.get(
      `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=pt_br`
    );
  }

  // 📍 Previsão por GPS
  getForecastByCoords(lat: number, lon: number) {
    return this.http.get(
      `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=pt_br`
    );
  }
}