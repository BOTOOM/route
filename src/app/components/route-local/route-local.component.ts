import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-route-local',
  templateUrl: './route-local.component.html',
  styleUrls: ['./route-local.component.css']
})
export class RouteLocalComponent implements OnInit {

  modoIngresoSelect: string;
  OS_select: string;
  OS = ['Windows', 'Linux'];
  modoIngreso = ['archivo de texto', 'texto plano'];
  texto_plano: string;
  separacion = [];



  constructor() { }

  ngOnInit() {
  }

  obtenerTraza() {
    // console.log(this.OS_select);
    this.separacion = this.texto_plano.split(/\n/);
    console.log(this.separacion);
    for (let i = 0; i < this.separacion.length; i++) {
      // const trazaindi: string[] = separado[i].split(/\n/);
      // separado[i] =  trazaindi as string[];
      // console.log(this.separacion[i]);
      this.separacion[i] = this.separacion[i].split(' ');
    }
    console.log(this.separacion);
  }

}
