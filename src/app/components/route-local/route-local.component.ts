import { Component, OnInit } from '@angular/core';
import { GeoipService } from '../../services/geoip.service';

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
  error: any;
  carga: boolean;


  constructor(
    private geoip: GeoipService,
  ) {
    this.carga = false;
  }

  ngOnInit() {
  }

  obtenerTraza() {
    this.carga = false;
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
    for (let indice = 1; indice < this.separacion.length; indice++) {
      // console.log(this.separacion[i].length);
      // if( this.separacion[i].length === 14 ) {
        this.JsonTraza.push({
          salto: this.separacion[indice][1],
          nombre: this.separacion[indice][3],
          ip: this.separacion[indice][4].substring(1, this.separacion[indice][4].length - 1),
          ms: this.separacion[indice][6],
        });
      // }
    }
    console.log(this.JsonTraza);
    this.obtenerGeo();
  }

  obtenerGeo() {

    for (let i = 0; i < this.JsonTraza.length; i++) {
      this.geoip.get(this.JsonTraza[i]['ip']).subscribe( dato => {
      // console.log(dato);
        this.JsonTraza[i]['isp'] = dato['isp'];
        this.JsonTraza[i]['organizacion'] = dato['organization'];
        this.JsonTraza[i]['continente'] = dato['continent_name'];
        this.JsonTraza[i]['pais'] = dato['country_name'];
        this.JsonTraza[i]['capital'] = dato['country_capital'];
        this.JsonTraza[i]['ciudad'] = dato['city'];
        this.JsonTraza[i]['distrito'] = dato['district'];
        this.JsonTraza[i]['longitud'] = dato['longitude'];
        this.JsonTraza[i]['latitud'] = dato['latitude'];
        this.JsonTraza[i]['organizacion'] = dato['organization'];
    }, (error_service) => {
      // console.log(error_service);
      this.error = error_service;
      // console.log(`la ip ${this.JsonTraza[i]['ip']} es privada`);
      this.JsonTraza[i]['isp'] = '***';
        this.JsonTraza[i]['organizacion'] = '***';
        this.JsonTraza[i]['continente'] = '***';
        this.JsonTraza[i]['pais'] = '***';
        this.JsonTraza[i]['capital'] = '***';
        this.JsonTraza[i]['ciudad'] = '***';
        this.JsonTraza[i]['distrito'] = '***';
        this.JsonTraza[i]['longitud'] = '***';
        this.JsonTraza[i]['latitud'] = '***';
        this.JsonTraza[i]['organizacion'] = '***';
    });
    }
    // console.log(this.JsonTraza);
    this.carga = true;
  }

}
