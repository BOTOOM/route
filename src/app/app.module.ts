import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule  } from '@angular/core';
// imports de componentes como material
import { ThemeModule } from './theme.module';
import {HttpClientModule} from '@angular/common/http';

// rutas
import {APP_ROUTING} from './app.routes';

// import mdb
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { IconsModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/shared/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule ,
    HttpClientModule,
    IconsModule,
    MDBBootstrapModule.forRoot(),
    ThemeModule.forRoot(),
    RouterModule.forRoot(APP_ROUTING, {useHash: true}),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
