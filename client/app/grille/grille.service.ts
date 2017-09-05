import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
//const FACILE = true;
//const DIFFICILE = false;

@Injectable()
export class GrilleService {
  private socket = io('http://localhost:3002');
  public grilleTrous : number[][];
  public grilleToSubmit : number[][];

  constructor(){
    this.socket.on('grille-incomplete', (grilleIncomplete : number[][]) => {
      console.log("Sudoku recue");

      this.grilleToSubmit = grilleIncomplete;
      this.grilleTrous = copy(grilleIncomplete);


      console.log(this.grilleTrous);
    });

  }



  // Prend une grille en parametre a comparer avec la
  // grille complete du serveur
  verifierGrilleEstCorrecte(grilleAEnvoyer: number[][]) : Promise<boolean> {
    this.socket.emit('validate-sudoku', grilleAEnvoyer);
    console.log(grilleAEnvoyer);
    return new Promise<boolean>((resolve) => {
      this.socket.on('validation', (estCorrecte: boolean) => {
        console.log("estCorrecte dans service: " + estCorrecte );
         console.log("validation recue");
         resolve(estCorrecte);
      });
    });
  }

  getSudoku(difficulte : boolean) : Promise<number[][]> {
    this.socket.emit('request-sudoku', difficulte);
    return new Promise<number[][]>((resolve) => {
      this.socket.on('grille-incomplete', (grilleIncomplete : number[][]) => {
        console.log("Sudoku recue");
        resolve(grilleIncomplete);
      });
    });
  }
}

function copy(arr: any): any {
    let newArr = arr.slice(0);
    for (let i = newArr.length; i--; ){
        if (newArr[i] instanceof Array){
            newArr[i] = copy(newArr[i]);
        }
    }
    return newArr;
}
