import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MatComponent } from './components/mat/mat.component';

const APP_ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'mat', component: MatComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = (APP_ROUTES);
