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
  texto_obtenido: any;
  separacion = [];
  JsonTraza = [];
  error: any;
  carga: boolean;
  lat = 4.66774;
  lng = -74.13200;
  zoom = 2;
  markers: Marker[] = [];


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
    if (this.OS_select === 'Windows') {
      this.ConvertirJsonWindows();
    }
  }

  CovertirJsonLinux() {
    for (let indice = 1; indice < this.separacion.length; indice++) {
      // console.log(this.separacion[i].length);
      if ( this.separacion[indice].length > 7 ) {
        this.JsonTraza.push({
          salto: this.separacion[indice][1],
          nombre: this.separacion[indice][3],
          ip: this.separacion[indice][4].substring(1, this.separacion[indice][4].length - 1),
          ms: this.separacion[indice][6],
        });
      }
    }
    console.log(this.JsonTraza);
    this.obtenerGeo();
  }

  ConvertirJsonWindows() {
    for (let indice = 0; indice < this.separacion.length; indice++) {
      let NumSalto;
      if (this.separacion[indice].length > 12) {
        if (this.separacion[indice][2] !== '') {
          NumSalto = this.separacion[indice][2];
        } else {
          NumSalto = this.separacion[indice][1];
        }
        // console.log(this.separacion[indice]);
        if ( this.separacion[indice][ this.separacion[ indice ].length - 3 ] !== '' ) {
            // console.log(`el nombre del punto es ${this.separacion[indice][ this.separacion[ indice ].length - 3 ]}`);
            if ( this.separacion[indice][ this.separacion[ indice ].length - 2 ].length > 6 ) {
              this.JsonTraza.push({
                salto: NumSalto,
                nombre: this.separacion[indice][ this.separacion[ indice ].length - 3 ],
                // ip: this.separacion[indice][4].substring(1, this.separacion[indice][4].length - 1),
                ip: this.separacion[indice][ this.separacion[ indice ].length - 2 ]
                .substring(1, this.separacion[indice][ this.separacion[ indice ].length - 2 ].length - 1),
                ms: this.separacion[indice][ this.separacion[ indice ].length - 6 ],
              });
            }
        } else {
          // console.log(`no hay nombre solo direccion: ${this.separacion[indice][ this.separacion[ indice ].length - 2 ]}`);
          if (this.separacion[indice][ this.separacion[ indice ].length - 2 ].length > 6 ) {
            this.JsonTraza.push({
              salto: NumSalto,
              nombre: '',
              // ip: this.separacion[indice][4].substring(1, this.separacion[indice][4].length - 1),
              ip: this.separacion[indice][ this.separacion[ indice ].length - 2 ],
              ms: this.separacion[indice][ this.separacion[ indice ].length - 5 ],
            });
          }
        }
      }
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
        this.markers.push({
          lat: Number(dato['latitude']),
          lng: Number(dato['longitude']),
          label: this.JsonTraza[i]['salto'],
          draggable: false,
        });
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
    console.log(this.markers);
  }

  onFileSelect(input: HTMLInputElement) {
    console.log(input);
    const file: File = input.files[0];
    const myReader = new FileReader();
    myReader.readAsText(file);
    myReader.onload = (e) => {
      this.texto_obtenido = myReader.result;
      this.texto_plano = this.texto_obtenido;
      console.log(this.texto_plano);
      this.obtenerTraza();
  };
  }

}

interface Marker {
lat: number;
lng: number;
label?: string;
draggable: boolean;
}
