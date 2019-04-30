import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tamano: number;
  matrizQ = [];
  matrizX = [];
  matrizXT = [];
  matrizclave = [];
  Qon: boolean;
  constructor() {
    this.Qon = false;
  }

  ngOnInit() {
  }

  crearMatriz() {
    this.Qon = true;
    this.matrizQ = [];
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
      }
    }
    // console.log(this.matrizQ);
  }

  obtenerQ() {
    console.log(this.matrizQ);
    this.invertir();
  }

  invertir() {
    for (let i = 0; i < this.tamano; i++) {
      for (let j = 0; j < this.tamano; j++) {
        this.matrizXT[j][i] = this.matrizQ[i][j];
      }
    }
    console.log(this.matrizXT);
  }

}
