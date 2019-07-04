import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MatComponent } from './components/mat/mat.component';
import { PlotComponent } from './components/plot/plot.component';
import { RouteLocalComponent } from './components/route-local/route-local.component';
import { RouteGlobalComponent } from './components/route-global/route-global.component';

const APP_ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'mat', component: MatComponent },
  { path: 'plot', component: PlotComponent },
  { path: 'route-local', component: RouteLocalComponent },
  { path: 'route-global', component: RouteGlobalComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = (APP_ROUTES);
