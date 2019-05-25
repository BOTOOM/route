import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule  } from '@angular/core';
// imports de componentes como material
import { ThemeModule } from './theme.module';

// chart
import { ChartsModule } from 'ng2-charts';
import { NgxGraphModule } from '@swimlane/ngx-graph';

// rutas
import {APP_ROUTING} from './app.routes';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { MatComponent } from './components/mat/mat.component';
import { PlotComponent } from './components/plot/plot.component';
import { DiagramaComponent } from './components/diagrama/diagrama.component';
import { RouteLocalComponent } from './components/route-local/route-local.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    MatComponent,
    PlotComponent,
    DiagramaComponent,
    RouteLocalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ChartsModule,
    NgxGraphModule,
    ReactiveFormsModule ,
    ThemeModule.forRoot(),
    RouterModule.forRoot(APP_ROUTING, {useHash: true}),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
