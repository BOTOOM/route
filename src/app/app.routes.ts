import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RouteGlobalComponent } from './components/route-global/route-global.component';

const APP_ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'route-local',
    loadChildren: () => import('./route-local/route-local.module').then(m => m.RouteLocalModule)
  },
  { path: 'route-global', component: RouteGlobalComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = (APP_ROUTES);
