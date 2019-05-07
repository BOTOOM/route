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

  mostrarDatos() {
    // console.log(this.scatterChartData[0]['data']);
    // const valor =  [
    //       { x: 13, y: 4 },
    // ];
    // valor.push(
    //   {
    //     x: 3,
    //     y: 4,
    //   }
    // );
    this.scatterChartData[0].data = this.valores;
    this.plot = true;
  }

  crearCampos() {
    this.restriciones = [];
    for (let i = 0; i < this.cantidad; i++) {
      this.restriciones[i] = new Array(2);
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

}
