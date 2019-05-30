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
  JsonTraza = [];



  constructor() { }

  ngOnInit() {
  }

  obtenerTraza() {
    this.separacion = [];
    this.JsonTraza = [];
    this.separacion = this.texto_plano.split(/\n/);
    // console.log(this.separacion);
    for (let i = 0; i < this.separacion.length; i++) {
      this.separacion[i] = this.separacion[i].split(' ');
    }
    console.log(this.separacion);
    if (this.OS_select === 'Linux') {
      this.CovertirJsonLinux();
    }
  }

  CovertirJsonLinux() {
    for (let i = 1; i < this.separacion.length; i++) {
      // console.log(this.separacion[i].length);
      // if( this.separacion[i].length === 14 ) {
        this.JsonTraza.push({
          salto: this.separacion[i][1],
          nombre: this.separacion[i][3],
          ip: this.separacion[i][4].substring(1, this.separacion[i][4].length - 1),
          ms: this.separacion[i][6],
        });
      // }
    }
    console.log(this.JsonTraza);
  }

}
