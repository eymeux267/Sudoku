import { Component, OnInit } from '@angular/core';
import { Score } from './scores/score';
import { Time } from './timer/time';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html'
  ,
 styleUrls: [`app/app.component.css`],
})
export class AppComponent implements OnInit{
    public partieEstCommencee: boolean;
    public partieEstFinie: boolean;
    public scoreEnvoye: Score;
    public difficulte: boolean;
    public nomJoueur : string;

    constructor(){
      this.partieEstCommencee = false;
      this.partieEstFinie = false;
      this.nomJoueur = '';
      this.scoreEnvoye = new Score();
      this.scoreEnvoye.temps = new Time(6000);
    }

    ngOnInit(){
      this.demanderNom();
    }

  demanderNom(){
    this.scoreEnvoye.nomJoueur = "";
    while (this.scoreEnvoye.nomJoueur === ""){
       this.scoreEnvoye.nomJoueur = prompt("Entrez votre nom pour la partie");
    }
  }

  commencerPartie(difficulte: boolean){
      this.difficulte = difficulte;
      this.partieEstCommencee = true;
  }

  changerDifficulte(difficulte: boolean){
    this.difficulte = difficulte;
  }

  afficherFelicitations(temps: Time){
    this.partieEstFinie = true;
    this.scoreEnvoye.temps = temps;
    alert("Félicitations! Vous avez réussi le Sudoku.");
  }

 }
