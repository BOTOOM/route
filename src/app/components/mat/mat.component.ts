import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mat',
  templateUrl: './mat.component.html',
  styleUrls: ['./mat.component.css']
})
export class MatComponent implements OnInit {

  tamano: number;
  matrizQ = [];
  matrizX = [];
  matrizXT = [];
  matrizclave = [];
  Qon: boolean;
  res: boolean;
  resT: boolean;
  constructor() {
    this.Qon = false;
    this.res = false;
    this.resT = false;
  }

  ngOnInit() {
  }

  crearMatriz() {
    this.Qon = true;
    this.res = false;
    this.resT = false;
    this.matrizQ = [];
    this.matrizclave = [];
    this.matrizX = [];
    this.matrizXT = [];
    console.log(this.tamano);
    for (let i = 0; i < this.tamano; i++) {
      this.matrizQ[i] = new Array(this.tamano);
      this.matrizX[i] = new Array(this.tamano);
      this.matrizXT[i] = new Array(this.tamano);
      this.matrizclave[i] = new Array(this.tamano);
    }
    for (let i = 0; i < this.tamano; i++) {
      for (let j = 0; j < this.tamano; j++) {
        this.matrizQ[i][j] = 0;
        this.matrizX[i][j] = 0;
        this.matrizXT[i][j] = 0;
        this.matrizclave[i][j] = 0;
      }
    }
    // console.log(this.matrizQ);
  }

  obtenerQ() {
    console.log(this.matrizQ);
    // this.invertir();
  }

  obtenerClave() {
    console.log(this.matrizclave);
    // this.invertir();
    this.clave_X_Q();
  }

  trapuesta() {
    for (let i = 0; i < this.tamano; i++) {
      for (let j = 0; j < this.tamano; j++) {
        this.matrizX[j][i] = this.matrizXT[i][j];
      }
    }
    console.log(this.matrizX);
    this.resT = true;
  }

  clave_X_Q() {
    for (let i = 0; i < this.tamano; i++) {
      for (let j = 0; j < this.tamano; j++) {
        for (let l = 0; l < this.tamano; l++) {
          this.matrizXT[i][j] = this.matrizXT[i][j] +  (this.matrizclave[i][l] * this.matrizQ[l][j]);
        }
      }
    }
    console.log(this.matrizXT);
    this.res = true;
    this.trapuesta();
  }

}
