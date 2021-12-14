import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouteGlobalRoutingModule } from './route-global-routing.module';
import { RouteGlobalComponent } from './route-global.component';
// import api google maps
import { AgmCoreModule } from '@agm/core';
// imports de componentes como material
import { ThemeModule } from '../theme.module';
import {HttpClientModule} from '@angular/common/http';
// chart
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [RouteGlobalComponent],
  imports: [
    CommonModule,
    RouteGlobalRoutingModule,FormsModule,
    ChartsModule,
    ReactiveFormsModule ,
    ThemeModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBeh_MR7yO7QzliNFhgITYzGnn80Dn_q74'
    }),
  ]
})
export class RouteGlobalModule { }
