import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RouteLocalComponent} from './route-local.component';


const routes: Routes = [
  { path: '', component: RouteLocalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteLocalRoutingModule { }
