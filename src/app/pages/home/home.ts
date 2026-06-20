import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  city: string = '';

  weatherData: any;
  forecastDays: any[] = [];

  favorites: string[] = [];

  constructor(private weatherService: WeatherService) {
    this.loadFavorites();

    this.requestNotificationPermission();

    // 📦 CACHE - carrega último clima salvo
    const lastWeather = localStorage.getItem('last_location_weather');

    if (lastWeather) {
      this.weatherData = JSON.parse(lastWeather);
      this.city = this.weatherData.name;
    }
  }

  // 🔔 Solicita permissão para notificações
  requestNotificationPermission() {

    if (!('Notification' in window)) {
      console.log('Notificações não suportadas');
      return;
    }

    Notification.requestPermission();
  }

  // 🔔 Notificação de teste
  showTestNotification() {

    if (Notification.permission === 'granted') {

      new Notification('Angular Weather', {
        body: 'Notificações funcionando com sucesso!'
      });

    } else {

      alert('Permita notificações primeiro.');

    }
  }

  // 🔔 Notificação baseada no clima
  checkWeatherAlert(data: any) {

    if (Notification.permission !== 'granted') return;

    const temp = data.main.temp;
    const climate = data.weather[0].main;

    if (climate === 'Rain') {

      new Notification('🌧️ Alerta de Chuva', {
        body: `Pode chover em ${data.name}. Leve um guarda-chuva!`
      });

    } else if (temp >= 35) {

      new Notification('☀️ Muito Calor', {
        body: `${data.name} está com ${temp}°C. Hidrate-se!`
      });

    } else if (temp <= 10) {

      new Notification('❄️ Frio Intenso', {
        body: `${data.name} está com ${temp}°C. Agasalhe-se!`
      });

    }
  }

  // 🔍 Busca por cidade
  searchCity() {

    if (!this.city) return;

    this.weatherService.getWeather(this.city)
      .subscribe({
        next: (data: any) => {

          this.weatherData = data;

          // 📦 CACHE
          localStorage.setItem(
            'weather_' + this.city.toLowerCase(),
            JSON.stringify(data)
          );

          this.checkWeatherAlert(data);
        },

        error: (err) => {

          console.error(err);

          // 📦 CACHE OFFLINE
          const cache = localStorage.getItem(
            'weather_' + this.city.toLowerCase()
          );

          if (cache) {

            this.weatherData = JSON.parse(cache);

            alert(
              'Sem internet. Exibindo dados salvos anteriormente.'
            );

          } else {

            alert(
              'Cidade não encontrada e nenhum cache disponível.'
            );

          }
        }
      });

    this.weatherService.getForecast(this.city)
      .subscribe({
        next: (data: any) => {

          this.forecastDays = this.groupByDay(data.list);

          // 📦 CACHE
          localStorage.setItem(
            'forecast_' + this.city.toLowerCase(),
            JSON.stringify(data.list)
          );
        },

        error: () => {

          const cache = localStorage.getItem(
            'forecast_' + this.city.toLowerCase()
          );

          if (cache) {

            const list = JSON.parse(cache);

            this.forecastDays = this.groupByDay(list);
          }
        }
      });
  }

  // 📍 Busca usando GPS
  getCurrentLocation() {

    if (!navigator.geolocation) {
      alert('Geolocalização não suportada.');
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Clima atual
        this.weatherService
          .getWeatherByCoords(lat, lon)
          .subscribe({
            next: (data: any) => {

              this.weatherData = data;
              this.city = data.name;

              // 📦 CACHE GPS
              localStorage.setItem(
                'last_location_weather',
                JSON.stringify(data)
              );

              this.checkWeatherAlert(data);

            },
            error: (err) => {
              console.error(err);
              alert('Erro ao obter clima pela localização');
            }
          });

        // Previsão 5 dias
        this.weatherService
          .getForecastByCoords(lat, lon)
          .subscribe({
            next: (data: any) => {

              this.forecastDays = this.groupByDay(data.list);

              // 📦 CACHE GPS
              localStorage.setItem(
                'last_location_forecast',
                JSON.stringify(data.list)
              );
            },
            error: (err) => {
              console.error(err);
            }
          });
      },

      (error) => {
        console.error(error);
        alert('Permissão de localização negada');
      }

    );
  }

  // 📅 Organiza previsão
  groupByDay(list: any[]) {

    const days: any = {};

    list.forEach(item => {

      const date = item.dt_txt.split(' ')[0];

      if (!days[date]) {
        days[date] = {
          date,
          temp: item.main.temp,
          icon: item.weather[0].icon,
          description: item.weather[0].description
        };
      }

    });

    return Object.values(days).slice(0, 5);
  }

  // 🌤️ Ícone
  getIcon(icon: string) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  // ⭐ Favoritos
  saveFavorite(city: string) {

    if (!city) return;

    if (!this.favorites.includes(city)) {
      this.favorites.push(city);
      this.updateLocalStorage();
    }
  }

  removeFavorite(city: string) {
    this.favorites = this.favorites.filter(c => c !== city);
    this.updateLocalStorage();
  }

  selectFavorite(city: string) {
    this.city = city;
    this.searchCity();
  }

  // 💾 LocalStorage
  updateLocalStorage() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  loadFavorites() {

    const data = localStorage.getItem('favorites');

    if (data) {
      this.favorites = JSON.parse(data);
    }
  }
}