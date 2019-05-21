import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Edge, Node, ClusterNode, Layout } from '@swimlane/ngx-graph';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrls: ['./diagrama.component.css']
})
export class DiagramaComponent implements OnInit {

  nombreNodo: string;
  pesoNodo: number;
  nodoInicio: string;
  nodoDestino: string;
  RutaInicio: string;
  RutaFinal: string;
  Ruta: string;
  CosteRuta: number;
  NodosCop: any[] = [
    {
      id: 'A',
      label: 'A',
      Peso: 0,
    },
    {
      id: 'B',
      label: 'B',
      Peso: 0,
    },
    {
      id: 'G',
      label: 'G',
      Peso: 0,
    },
    {
      id: 'D',
      label: 'D',
      Peso: 0,
    }
    ,
    {
      id: 'E',
      label: 'E',
      Peso: 0,
    },
    {
      id: 'S',
      label: 'S',
      Peso: 0,
    },
  ];
  // nodosNuevos: Node[] = [
  //   {
  //     id: this.nombreNodo,
  //     label: this.nombreNodo
  //   },
  // ];

  nodes: Node[] = [
    {
      id: 'A',
      label: 'A'
    },
    {
      id: 'B',
      label: 'B'
    },
    {
      id: 'G',
      label: 'G'
    },
    {
      id: 'D',
      label: 'D'
    },
    {
      id: 'E',
      label: 'E'
    },
    {
      id: 'S',
      label: 'S'
    },
  ];

  links: Edge[]  = [
    {
      id: 'AB',
      source: 'A',
      target: 'B',
      label: '2'
    },
    {
      id: 'SA',
      source: 'S',
      target: 'A',
      label: '6'
    },
    {
      id: 'SB',
      source: 'S',
      target: 'B',
      label: '1'
    },
    {
      id: 'AD',
      source: 'A',
      target: 'D',
      label: '4'
    },
    {
      id: 'AE',
      source: 'A',
      target: 'E',
      label: '1'
    },
    {
      id: 'DE',
      source: 'D',
      target: 'E',
      label: '2'
    },
    {
      id: 'BE',
      source: 'B',
      target: 'E',
      label: '20'
    },
    {
      id: 'DG',
      source: 'D',
      target: 'G',
      label: '5'
    },
    {
      id: 'EG',
      source: 'E',
      target: 'G',
      label: '10'
    },
  ];

  layout: String | Layout = 'colaForceDirected';
  layouts: any[] = [
    {
      label: 'Dagre',
      value: 'dagre',
    },
    {
      label: 'Dagre Cluster',
      value: 'dagreCluster',
      isClustered: true,
    },
    {
      label: 'Cola Force Directed',
      value: 'colaForceDirected',
      isClustered: true,
    },
    {
      label: 'D3 Force Directed',
      value: 'd3ForceDirected',
    },
  ];

  // line interpolation
  curveType = 'Bundle';
  curve: any = shape.curveLinear;

  draggingEnabled = true;
  panningEnabled = true;
  zoomEnabled = true;

  zoomSpeed = 0.1;
  minZoomLevel = 0.1;
  maxZoomLevel = 4.0;
  panOnZoom = true;

  autoZoom = false;
  autoCenter = false;

  constructor() {
    // console.log(this.nodes);
    // console.log(this.links);
  }

  ngOnInit() {
    this.setInterpolationType(this.curveType);
  }

  setInterpolationType(curveType) {
    this.curveType = curveType;
    if (curveType === 'Bundle') {
      this.curve = shape.curveBundle.beta(1);
    }
    if (curveType === 'Cardinal') {
      this.curve = shape.curveCardinal;
    }
    if (curveType === 'Catmull Rom') {
      this.curve = shape.curveCatmullRom;
    }
    if (curveType === 'Linear') {
      this.curve = shape.curveLinear;
    }
    if (curveType === 'Monotone X') {
      this.curve = shape.curveMonotoneX;
    }
    if (curveType === 'Monotone Y') {
      this.curve = shape.curveMonotoneY;
    }
    if (curveType === 'Natural') {
      this.curve = shape.curveNatural;
    }
    if (curveType === 'Step') {
      this.curve = shape.curveStep;
    }
    if (curveType === 'Step After') {
      this.curve = shape.curveStepAfter;
    }
    if (curveType === 'Step Before') {
      this.curve = shape.curveStepBefore;
    }
  }


  // setLayout(layoutName: string): void {
  //   const layout = this.layouts.find(l => l.value === layoutName);
  //   this.layout = layoutName;
  //   if (!layout.isClustered) {
  //     this.clusters = undefined;
  //   } else {
  //     this.clusters = clusters;
  //   }
  // }

  crearNodo() {
    this.nodes.push(
      {
        id: this.nombreNodo,
        label: this.nombreNodo,
        dimension: {
          width: 30,
          height: 30,
        },
        data: {
          color: '#7aa3e5',
        },
      }
    );
    this.NodosCop.push(
      {
        id: this.nombreNodo,
        label: this.nombreNodo,
        Peso: 0,
      }
    );
    // console.log(this.nodes);
    // console.log(this.NodosCop);
  }

  crearUnion() {
    this.links.push(
      {
        id: `${this.nodoInicio}_${this.nodoDestino}`,
        label: `${this.pesoNodo}`,
        source: `${this.nodoInicio}`,
        target: `${this.nodoDestino}`,
      }
    );
    // console.log(this.links);
  }

  BuscarRuta() {
    this.Ruta = '';
    this.LimpiarRuta();
    // console.log(this.RutaFinal);
    for (let i = 0; i < this.links.length; i++) {
      if ( this.links[i].target === this.RutaFinal ) {
        // console.log(`entro al link ${this.links[i].id}`);
        this.BuscarNodos( this.links[i].source, this.links[i].target , Number(this.links[i].label) );
      }
    }
  }

  BuscarNodos(NodoEntrante: string, NodoSalida: string , peso: number) {
    if (this.RutaInicio === NodoEntrante) {
      // console.log('llegue al inicio de la ruta wiiii');
      this.CalcularPeso( peso , NodoEntrante , NodoSalida , true);
    } else {
      // console.log('bucando aun');
      for (let i = 0; i < this.links.length; i++) {
        if (this.links[i].target === NodoEntrante) {
          // console.log(`entro al link ${this.links[i].id}`);
          this.CalcularPeso( peso , NodoEntrante , NodoSalida);
          this.BuscarNodos( this.links[i].source, this.links[i].target , Number(this.links[i].label) );
        }
      }
    }
  }

  CalcularPeso( Peso: number , NodoIzq: string , NodoDer: string , finalRuta?: boolean) {
    for (let i = 0; i < this.NodosCop.length; i++) {
      if ( this.NodosCop[i]['id'] === NodoDer ) {
        for (let j = 0; j < this.NodosCop.length; j++) {
          if ( this.NodosCop[j]['id'] === NodoIzq ) {
            const PesoSumado = Peso + this.NodosCop[i]['Peso'];
            if ( PesoSumado > this.NodosCop[j]['Peso'] ) {
              this.NodosCop[j]['Peso'] = PesoSumado;
              // console.log(`peso actual del nodo: ${NodoIzq} es ${this.NodosCop[j]['Peso']}`);
              if ( finalRuta ) {
                this.CosteRuta = this.NodosCop[j]['Peso'];
                console.log(`peso mandado ${this.NodosCop[j]['Peso']}`);
                console.log(`peso deseado a mostrar ${this.CosteRuta}`)
                this.CrearRuta(NodoIzq , this.NodosCop[j]['Peso'] , NodoIzq);
              }
            }
          }
        }
      }
    }
    // console.log(this.NodosCop);
  }

  CrearRuta(NodoSource: string, pesoSource: number , RUTA: string) {
    // console.log('entro a crear ruta');
    // let ruta = '';
    for (let i = 0; i < this.links.length; i++) {
      if (this.links[i].source === NodoSource) {
        for (let j = 0; j < this.NodosCop.length; j++) {
          if (this.NodosCop[j]['id'] === this.links[i].target) {
            const resta = pesoSource - Number(this.links[i].label);
            if (resta === this.NodosCop[j]['Peso']) {
              RUTA += ` > ${this.NodosCop[j]['id']}`;
              this.Ruta = RUTA;
              // console.log(RUTA);
              this.CrearRuta(this.NodosCop[j]['id'] , this.NodosCop[j]['Peso'] , RUTA);
            }
          }
        }
      }
    }
  }

  Limpiar() {
    this.nodes = [
      {
        id: 'A',
        label: 'A',
        dimension: {
          width: 30,
          height: 30,
        },
        data: {
          color: '#7aa3e5',
        },
      },
    ];
    this.NodosCop = [
      {
        id: 'A',
        label: 'A',
        dimension: {
          width: 30,
          height: 30,
        },
        data: {
          color: '#7aa3e5',
        },
        Peso: 0,
      },
    ];

    this.links = [];

  }

  LimpiarRuta() {

    for (let i = 0; i < this.NodosCop.length; i++) {
      this.NodosCop[i]['Peso'] = 0;
    }
  }
}
