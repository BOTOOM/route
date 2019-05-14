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
  // nodosNuevos: Node[] = [
  //   {
  //     id: this.nombreNodo,
  //     label: this.nombreNodo
  //   },
  // ];

  nodes: Node[] = [
    {
      id: 'first',
      label: 'A'
    },
    // {
    //   id: 'second',
    //   label: 'B'
    // },
    // {
    //   id: 'c1',
    //   label: 'C1'
    // }, {
    //   id: 'c2',
    //   label: 'C2'
    // }
  ];

  links: Edge[]  = [
    // {
    //   id: 'a',
    //   source: 'first',
    //   target: 'second',
    //   label: 'is parent of'
    // },
    // {
    //   id: 'b',
    //   source: 'first',
    //   target: 'c1',
    //   label: 'cosa 1'
    // }, {
    //   id: 'c',
    //   source: 'c1',
    //   target: 'first',
    //   label: 'cosa 2'
    // }, {
    //   id: 'd',
    //   source: 'first',
    //   target: 'c2',
    //   label: 'cosa 3'
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
    console.log(this.nodes);
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
    // this.nodes = this.nodosNuevos;
    console.log(this.nodes);
    // console.log(this.nodosNuevos);
  }
}
