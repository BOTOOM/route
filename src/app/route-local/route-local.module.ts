import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouteLocalRoutingModule } from './route-local-routing.module';
import { RouteLocalComponent } from './route-local.component';
// import api google maps
import { AgmCoreModule } from '@agm/core';
// imports de componentes como material
import { ThemeModule } from '../theme.module';
import {HttpClientModule} from '@angular/common/http';
// chart
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [RouteLocalComponent],
  imports: [
    CommonModule,
    RouteLocalRoutingModule,FormsModule,
    ChartsModule,
    ReactiveFormsModule ,
    ThemeModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBeh_MR7yO7QzliNFhgITYzGnn80Dn_q74'
    }),
  ]
})
export class RouteLocalModule { }
