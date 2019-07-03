import { Component, OnInit } from '@angular/core';
import { GeoipService } from '../../services/geoip.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-route-global',
  templateUrl: './route-global.component.html',
  styleUrls: ['./route-global.component.css']
})
export class RouteGlobalComponent implements OnInit {

  modoIngresoSelect: string;
  OS_select = 'Linux';
  OS = ['Windows', 'Linux'];
  modoIngreso = ['archivo de texto', 'texto plano'];
  servidores = ['Armerica', 'Europa', 'Asia', 'Oceania'];
  texto_plano: string;
  texto_obtenido: any;
  separacion = [];
  JsonTraza = [];
  error: any;
  carga: boolean;
  mapa: boolean;
  mostrarChart: boolean;
  lat = 4.66774;
  lng = -74.13200;
  zoom = 2;
  markers: Marker[] = [];
  polilinea: Poly[] = [];
  IpDestino: string;

  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'line';
  barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [], label: '' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];


  constructor(
    private geoip: GeoipService,
  ) {
    this.carga = false;
    this.mapa = false;
    this.mostrarChart = false;
    const cosa = Number('10');
    console.log(cosa);
    console.log(cosa.toString());
    if (cosa.toString() === 'NaN') {
      console.log('eso no era un numero');
    }
  }

  ngOnInit() {
  }

  sitioAmerica() {
    const url = `http://www.slac.stanford.edu/cgi-bin/nph-traceroute.pl?target=${this.IpDestino}&function=traceroute`;
    window.open( url, '_blank');
  }

  obtenerTraza(servidor: string) {
    console.log(servidor);
    this.carga = false;
    this.mapa = false;
    this.separacion = [];
    this.JsonTraza = [];
    this.separacion = this.texto_plano.split(/\n/);
    // console.log(this.separacion);
    for (let i = 0; i < this.separacion.length; i++) {
      this.separacion[i] = this.separacion[i].split(' ');
    }
    console.log(this.separacion);
    if (servidor === 'Armerica') {
      this.CovertirJsonLinux();
    }
    if (this.OS_select === 'Linux') {
      this.CovertirJsonLinux();
    }
    if (this.OS_select === 'Windows') {
      this.ConvertirJsonWindows();
    }
  }

  CovertirJsonLinux() {
    for (let indice = 1; indice < this.separacion.length; indice++) {
      let NumSalto: number;
      // console.log(this.separacion[i].length);
      if ( this.separacion[indice].length > 7 ) {
        for (let j = 0; j < 3; j++) {
          if ( ( Number(this.separacion[indice][j]) !== 0) && ( Number(this.separacion[indice][j]).toString() !== 'NaN' ) ) {
            NumSalto = this.separacion[indice][j];
          }
        }
        this.JsonTraza.push({
          salto: NumSalto,
          nombre: this.separacion[indice][3],
          ip: this.separacion[indice][4].substring(1, this.separacion[indice][4].length - 1),
          ms: this.separacion[indice][6],
        });
      }
    }
    console.log(this.JsonTraza);
    this.obtenerGeo();
    this.datosChart();
  }

  ConvertirJsonWindows() {
    for (let indice = 0; indice < this.separacion.length; indice++) {
      let NumSalto: number;
      let Ms: string;
      if (this.separacion[indice].length > 12) {
        for (let j = 0; j < 3; j++) {
          if ( ( Number(this.separacion[indice][j]) !== 0) && ( Number(this.separacion[indice][j]).toString() !== 'NaN' ) ) {
            NumSalto = this.separacion[indice][j];
          }
        }
        // console.log(this.separacion[indice]);
        if ( this.separacion[indice][ this.separacion[ indice ].length - 3 ] !== '' ) {
            // console.log(`el nombre del punto es ${this.separacion[indice][ this.separacion[ indice ].length - 3 ]}`);
            if ( this.separacion[indice][ this.separacion[ indice ].length - 2 ].length > 6 ) {
              if (this.separacion[indice][ this.separacion[ indice ].length - 6 ][0] === '<') {
                Ms = this.separacion[indice][ this.separacion[ indice ].length - 6 ].substring(1);
              } else {
                Ms = this.separacion[indice][ this.separacion[ indice ].length - 6 ];
              }
              this.JsonTraza.push({
                salto: NumSalto,
                nombre: this.separacion[indice][ this.separacion[ indice ].length - 3 ],
                // ip: this.separacion[indice][4].substring(1, this.separacion[indice][4].length - 1),
                ip: this.separacion[indice][ this.separacion[ indice ].length - 2 ]
                .substring(1, this.separacion[indice][ this.separacion[ indice ].length - 2 ].length - 1),
                ms: Number(Ms),
              });
            }
        } else {
          // console.log(`no hay nombre solo direccion: ${this.separacion[indice][ this.separacion[ indice ].length - 2 ]}`);
          if (this.separacion[indice][ this.separacion[ indice ].length - 2 ].length > 6 ) {
            if (this.separacion[indice][ this.separacion[ indice ].length - 5 ][0] === '<') {
              Ms = this.separacion[indice][ this.separacion[ indice ].length - 5 ].substring(1);
            } else {
              Ms = this.separacion[indice][ this.separacion[ indice ].length - 5 ];
            }
            this.JsonTraza.push({
              salto: NumSalto,
              nombre: '',
              // ip: this.separacion[indice][4].substring(1, this.separacion[indice][4].length - 1),
              ip: this.separacion[indice][ this.separacion[ indice ].length - 2 ],
              ms: Number(Ms),
            });
          }
        }
      }
    }
    console.log(this.JsonTraza);
    this.obtenerGeo();
    this.datosChart();
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
        this.JsonTraza[i]['tipo'] = 1; // si es 1 es publica
        if (i === ( this.JsonTraza.length - 1 ) ) {
          console.log(this.JsonTraza);
          // this.crearPuntos();
        }
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
        this.JsonTraza[i]['tipo'] = 0; // si es cero es privada
    });
    }
    // console.log(this.JsonTraza);
    this.carga = true;
    // console.log(this.markers);
  }

  crearPuntos () {
    for (let i = 0; i < this.JsonTraza.length; i++) {
      // console.log(this.JsonTraza[i]);  Number(this.separacion[indice][j]).toString() !== 'NaN'
      if (  this.JsonTraza[i]['tipo'] === 1) {
        this.markers.push({
          lat: Number(this.JsonTraza[i]['latitud']),
          lng: Number(this.JsonTraza[i]['longitud']),
          label: this.JsonTraza[i]['salto'],
          draggable: false,
        });
      }
      if (i === ( this.JsonTraza.length - 1 ) ) {
        console.log(this.markers);
        this.CrearLineas();
      }
    }
  }

  CrearLineas () {
    console.log('entra a creacion');
    this.polilinea = [];
    for (let i = 1; i < this.markers.length; i++) {
      this.polilinea.push({
        latIni: this.markers[i - 1].lat,
        lngIni: this.markers[i - 1].lng,
        latFin: this.markers[i].lat,
        lngFin: this.markers[i].lng,
      });
      if ( i === ( this.markers.length - 1 ) ) {
        console.log(this.polilinea);
        this.mapa = true;
      }
    }
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
      this.obtenerTraza('');
  };
  }

  // metodo para cambiar el tipo de chart
  public randomize(): void {
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }

  datosChart () {
    console.log('entra a los datos del chart');
    // console.log(this.barChartData[0]);
    this.barChartData[0].label = this.JsonTraza[this.JsonTraza.length - 1 ]['ip'];
    this.mostrarChart = true;
    this.barChartLabels = this.saltosChart();
    this.barChartData[0].data = this.VelocidadSaltosChart();
  }

  // fuuncion para obtener los labels a colocar en el eje horizontal
  saltosChart() {
    let labelSaltos = [];
    for (let i = 0; i < this.JsonTraza.length; i++) {
      labelSaltos.push(this.JsonTraza[i]['salto']);
    }
   return labelSaltos;
  }
  VelocidadSaltosChart() {
    let labelVelocidad = [];
    for (let i = 0; i < this.JsonTraza.length; i++) {
      labelVelocidad.push( Number(this.JsonTraza[i]['ms']));
    }
   return labelVelocidad;
  }

  test_tab() {
    console.log('entro');
  }

}

interface Marker {
lat: number;
lng: number;
label?: string;
draggable: boolean;
}

interface Poly {
  latIni: number;
  lngIni: number;
  latFin: number;
  lngFin: number;
  }
