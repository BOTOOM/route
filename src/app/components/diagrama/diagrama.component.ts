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
  NodosCop: any[] = [
    {
      id: 'A',
      label: 'A',
      Peso: 0,
    },
    // {
    //   id: 'B',
    //   label: 'B'
    // },
    // {
    //   id: 'C',
    //   label: 'C'
    // },
    // {
    //   id: 'D',
    //   label: 'D'
    // }
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
      id: 'C',
      label: 'C'
    },
    {
      id: 'D',
      label: 'D'
    }
  ];

  links: Edge[]  = [
    {
      id: 'AB',
      source: 'A',
      target: 'B',
      label: '9'
    },
    {
      id: 'BC',
      source: 'B',
      target: 'C',
      label: '1'
    },
    {
      id: 'DC',
      source: 'D',
      target: 'C',
      label: '4'
    },
    // {
    //   id: 'AD',
    //   source: 'A',
    //   target: 'D',
    //   label: '7'
    // }
  ];

  layout: String | Layout = 'dagreCluster';
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

  autoZoom = true;
  autoCenter = true;

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
        dimension: {
          width: 30,
          height: 30,
        },
        data: {
          color: '#7aa3e5',
        },
        Peso: 0,
      }
    );
    console.log(this.nodes);
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
    console.log(this.links);
  }

  BuscarRuta() {
    console.log(this.RutaFinal)
    for (let i = 0; i < this.links.length; i++) {
      if ( this.links[i].target === this.RutaFinal ) {
        console.log(`entro al link ${this.links[i].id}`);
        this.BuscarNodos( this.links[i].source, Number(this.links[i].label) );
      }
    }
  }

  BuscarNodos(NodoEntrante: string, peso: number) {
    if (this.RutaInicio === NodoEntrante) {
      console.log('llegue al inicio de la ruta wiiii');
      this.CalcularPeso( peso , NodoEntrante);
    } else {
      console.log('bucando aun');
      for (let i = 0; i < this.links.length; i++) {
        if (this.links[i].target === NodoEntrante) {
          console.log(`entro al link ${this.links[i].id}`);
          this.CalcularPeso( peso , NodoEntrante);
          this.BuscarNodos( this.links[i].source, Number(this.links[i].label) );
        }
      }
    }
  }

  CalcularPeso( Peso: number , Nodo: string ) {
    // console.log('entro a calcular peso');
    // console.log(this.NodosCop);
    for (let j = 0; j < this.NodosCop.length; j++) {
      // console.log('-------------------');
      // console.log(this.NodosCop[j]['id']);
      // console.log('------------------->');
      // console.log(Nodo);
      if ( this.NodosCop[j]['id'] === Nodo ) {
        // console.log('encntro el noodo para calcular peso');
        if ( Peso > this.NodosCop[j]['Peso'] ) {
          this.NodosCop[j]['Peso'] += Peso;
          console.log(`peso actual del nodo: ${Nodo} es ${this.NodosCop[j]['Peso']}`);
        }
      }
    }
  }
}
