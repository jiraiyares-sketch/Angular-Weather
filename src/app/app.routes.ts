import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { FavoritesComponent } from './pages/favorites/favorites';
import { ForecastComponent } from './pages/forecast/forecast';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'forecast', component: ForecastComponent }
];