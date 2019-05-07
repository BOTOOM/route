import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})
export class PlotComponent implements OnInit {

  items = [];
  cantidad: number;
  restriciones = [];
  valores = [];
  cant: boolean;
  plot: boolean;
  posiblesRes = [];

  public scatterChartOptions: ChartOptions = {
    responsive: true,
  };

  public scatterChartLabels: Label[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

  public scatterChartData: ChartDataSets[] = [
    {
      data: [
        { x: 0, y: 0 },
        // { x: 0, y: 14 },
        // { x: 3, y: 12 },
        // { x: 6, y: 6 },
        // { x: 8, y: 0 },
        // { x: 11, y: 0 },
      ],
      label: 'Puntos',
      pointRadius: 10,
    },
  ];

  public scatterChartType: ChartType = 'scatter';

  constructor() {
    this.cant = false;
    this.plot = false;
   }

  ngOnInit() {
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  crearCampos() {
    this.restriciones = [];
    this.posiblesRes = [];
    for (let i = 0; i < this.cantidad; i++) {
      this.restriciones[i] = new Array(2);
      this.posiblesRes[i] = new Array(3);
    }
    this.cant = true;
    this.plot = false;
  }

  crearValores() {
    this.valores = [];
    for (let i = 0; i < this.restriciones.length; i++) {
      this.valores.push(
        {
          x: this.restriciones[i][0],
          y: this.restriciones[i][1],
        }
      );
    }
    console.log(this.valores);
    this.mostrarDatos();
  }

  mostrarDatos() {
    this.scatterChartData[0].data = this.valores;
    this.plot = true;
    this.restricion();
  }

  restricion() {
    for (let j = 0; j < this.restriciones.length - 1; j++) {
      if ( (this.restriciones[j + 1][0] !== null ) && (this.restriciones[j + 1][0] !== undefined ) ) {
        // toma los valores x2 y x1 para el denominador de X , cx1 es el denominador de X
        const cx1 = this.restriciones[j + 1][0] - this.restriciones[j][0];
        // toma los valores y2 y y1 para el denominador de Y, cy1 es el denominador de y
        const cy1 = this.restriciones[j + 1][1] - this.restriciones[j][1];
        // toma los valores x2 y x1 parala constante generada por X , cx2 es constante
        const cx2 = (this.restriciones[j][0]) / (this.restriciones[j + 1][0] - this.restriciones[j][0]);
        // toma los valores y2 y y1 parala constante generada por Y , cy2 es constante
        const cy2 = (this.restriciones[j][1]) / (this.restriciones[j + 1][1] - this.restriciones[j][1]);
        // c es contante resultante de cx2 - cy2
        const c = cx2 - cy2;
        if (c < 0) {
          this.posiblesRes[j][0] = cx1 * (-1);
          this.posiblesRes[j][1] = cy1 * (-1);
          this.posiblesRes[j][2] = c * (-1);
        } else {
          this.posiblesRes[j][0] = cx1;
          this.posiblesRes[j][1] = cy1;
          this.posiblesRes[j][2] = c;
        }
      }
    }
    console.log(this.posiblesRes);
  }

}
