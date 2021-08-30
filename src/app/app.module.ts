import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule  } from '@angular/core';
// imports de componentes como material
import { ThemeModule } from './theme.module';
import {HttpClientModule} from '@angular/common/http';

// import api google maps
import { AgmCoreModule } from '@agm/core';

// chart
import { ChartsModule } from 'ng2-charts';

// rutas
import {APP_ROUTING} from './app.routes';

// import mdb
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { IconsModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { RouteLocalComponent } from './components/route-local/route-local.component';
import { RouteGlobalComponent } from './components/route-global/route-global.component';
import { FooterComponent } from './components/shared/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RouteLocalComponent,
    RouteGlobalComponent,
    FooterComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule ,
    HttpClientModule,
    IconsModule,
    MDBBootstrapModule.forRoot(),
    ThemeModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBeh_MR7yO7QzliNFhgITYzGnn80Dn_q74'
    }),
    RouterModule.forRoot(APP_ROUTING, {useHash: true}),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
