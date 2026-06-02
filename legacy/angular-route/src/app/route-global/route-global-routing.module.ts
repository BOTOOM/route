import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RouteGlobalComponent} from './route-global.component'


const routes: Routes = [
  { path: '', component: RouteGlobalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteGlobalRoutingModule { }
