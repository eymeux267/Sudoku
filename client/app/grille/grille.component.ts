// keyCode des touches du clavier
const GAUCHE = 37;
const HAUT = 38;
const DROITE = 39;
const BAS = 40;
const SUPPRIMER = 46;

const TAILLEBLOC = 3;
const VALIDE = true;
const ERRONNEE = false;

import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Time } from './../timer/time';
import { VerificateurSudoku } from './grille.verificateurSudoku';
import { GrilleService } from './grille.service';

@Component({
  moduleId: module.id,
  selector: 'grille-sudoku',
  templateUrl: './grille.component.html',
  styleUrls: ['./grille.style.css']
})
export class GrilleComponent implements AfterViewInit{

  @Input() public difficulte: boolean;
  @Output() partieEstFinie: EventEmitter<Time> = new EventEmitter<Time>();
  @Output() difficulteChangee: EventEmitter<boolean> = new EventEmitter<boolean>();

  public grilleAEnvoyer: number[][];
  public grilleTrous: number[][];
  public derniereCase: [number, number];

  public validiteLignes: boolean[];
  public validiteColonnes: boolean[];
  public validiteSousGrille: boolean[];

  public sudokuEstBienComplete: boolean;
  public reinitialiserChronometre: boolean;
  public terminerPartie: boolean;

  public touchesClavierCodes = new Map<number, number>();
  public codesTouchesClavier = new Map<number, number>();

   constructor(public grilleService: GrilleService) {
    this.grilleAEnvoyer = [[]];
    this.derniereCase = [null, null];
    this.sudokuEstBienComplete = false;
    this.reinitialiserChronometre = false;
    this.terminerPartie = false;
    this.validiteLignes = new Array(9).fill(VALIDE);
    this.validiteColonnes = new Array(9).fill(VALIDE);
    this.validiteSousGrille = new Array(9).fill(VALIDE);
    this.initialiserTouchesClavierMap();
  }

  ngAfterViewInit(){
    this.obtenirGrilles();
  }

  obtenirGrilles() : void {
      this.grilleService.getSudoku(!this.difficulte).then((sudoku : number[][]) => {
      this.grilleTrous = sudoku;
      this.grilleAEnvoyer = copy(sudoku);
      this.reinitialiserChronometre = false;
    });
  }

  initialiserTouchesClavierMap(): void{
    for (let i = 1; i <= 9; i++){
      this.touchesClavierCodes.set(i, i + 48);
      this.touchesClavierCodes.set(i + 48, i);
    }
  }

  requeteNouvelleGrille(difficulte: boolean){
    this.difficulte = difficulte;
    this.difficulteChangee.emit(difficulte);
    this.obtenirGrilles();
    this.reinitialiserChrono();
    this.validiteLignes = new Array(9).fill(VALIDE);
    this.validiteColonnes = new Array(9).fill(VALIDE);
    this.validiteSousGrille = new Array(9).fill(VALIDE);
  }

  reinitialiserChrono(){
    this.reinitialiserChronometre = true;
  }
  // Verifie si lusager a appuyer une fleche du clavier pour naviguer les cases du sudoku.
  // Focus sur la bonne case si cest le cas.
  gestionnaireTouchesClavier(keycode: any): void{
    // Pour ne pas depasser les limites de la grille, qui cause boucle infinie.
    switch (keycode){
      case(SUPPRIMER):
       this.supprimerCase();
       this.verifierSudoku();
       break;
      case (GAUCHE):
        this.allerAGauche();
        break;
      case(DROITE):
        this.allerADroite();
        break;
      case(HAUT):
        this.allerEnHaut();
        break;
      case(BAS):
        this.allerEnBas();
        break;
    }

  }
  supprimerCase(){
    // Si grilleTrous est null, la case est modifiable.
    if (this.grilleTrous[this.derniereCase[0]][this.derniereCase[1]] === null){
    this.grilleAEnvoyer[this.derniereCase[0]][this.derniereCase[1]] = null;
    }
  }
  allerAGauche(){
    let prochainI = this.derniereCase[0];
    let prochainJ = this.derniereCase[1];

    if (prochainJ === 0){
        prochainJ = 8;
    }
    else{
      prochainJ--;
     }

    this.derniereCase[0] = prochainI;
    this.derniereCase[1] = prochainJ;
  }

  allerADroite(){
    let prochainI = this.derniereCase[0];
    let prochainJ = this.derniereCase[1];

    if (prochainJ === 8){
       prochainJ = 0;
    }
      else{
        prochainJ++;
      }
    this.derniereCase[0] = prochainI;
    this.derniereCase[1] = prochainJ;
  }

  allerEnHaut(){
    let prochainI = this.derniereCase[0];
    let prochainJ = this.derniereCase[1];

    if (prochainI === 0){
      prochainI = 8;
   }
   else{
      prochainI--;
  }

    this.derniereCase[0] = prochainI;
    this.derniereCase[1] = prochainJ;
  }

  allerEnBas(){
    let prochainI = this.derniereCase[0];
    let prochainJ = this.derniereCase[1];

    if (prochainI === 8){
       prochainI = 0;
    }
   else{
      prochainI++;
   }

    this.derniereCase[0] = prochainI;
    this.derniereCase[1] = prochainJ;
  }


  entrerChiffre(keyCode: number){
    if (keyCode >= this.touchesClavierCodes.get(1)
          && keyCode <= this.touchesClavierCodes.get(9) &&
            this.grilleTrous[this.derniereCase[0]][this.derniereCase[1]] === null){

       this.grilleAEnvoyer[this.derniereCase[0]][this.derniereCase[1]] = this.touchesClavierCodes.get(keyCode);
     }

      let envoyerRequeteServeur = (this.verifierSudoku() && this.grilleEstRemplie());
      if (envoyerRequeteServeur)
      {
           this.comparerGrilleAvecCorrige();
      }
      console.log(this.grilleAEnvoyer);
      console.log(this.grilleTrous);
  }


  grilleEstRemplie(): boolean{
    let grilleRemplie = true;
    for (let ligne of this.grilleAEnvoyer){
      if (ligne.indexOf(null) !== -1){
        grilleRemplie = false;
      }
    }
      return grilleRemplie;
  }

  lancerFinPartieEvenement(temps: Time): void{
    this.partieEstFinie.emit(temps);
  }

  detecterFinPartie(){
    this.terminerPartie = true;
  }

  comparerGrilleAvecCorrige(){
      this.grilleService.verifierGrilleEstCorrecte(this.grilleAEnvoyer).then((estCorrecte: boolean) => {
          if (estCorrecte){
            this.detecterFinPartie();
          }
      });
  }

  obtenirColone(tableau : number[][], col : number){
     let column: any = [];
       for (let i = 0; i < tableau.length; i++){
          column.push(tableau[i][col]);
       }
       return column;
    }

   obtenirBloc(tableau : number[][], ligne : number, col : number) : number[] {
     let ligneArrondi = Math.floor(ligne / 3);
     let colonneArrondi = Math.floor(col / 3);
     let positionDebutBlocLigne: number;
     let positionDebutBlocColonne: number;

     positionDebutBlocLigne = ligneArrondi * 3;
     positionDebutBlocColonne = colonneArrondi * 3;

     let bloc: number[] = [];
     for (let i = positionDebutBlocLigne; i < positionDebutBlocLigne + TAILLEBLOC; i++){
        for (let j = positionDebutBlocColonne; j < positionDebutBlocColonne + TAILLEBLOC; j++){
          bloc.push(tableau[i][j]);
        }
     }
     return bloc;
    }

    trouverPositionSousGrille(i: number, j: number): number {
        return (Math.floor(i / 3)) * 3 + Math.floor(j / 3);
    }

  verifierSudoku(): boolean{
     let verificateurSudoku = new VerificateurSudoku;
     let ligneEstValide = true;
     let colonneEstValide = true;
     let sousGrilleEstValide = true;
     ligneEstValide = verificateurSudoku.verifierBlocValide(this.grilleAEnvoyer[this.derniereCase[0]]);
     colonneEstValide = verificateurSudoku.verifierBlocValide(this.obtenirColone(
                                                        this.grilleAEnvoyer, this.derniereCase[1]));
     sousGrilleEstValide = verificateurSudoku.verifierBlocValide(this.obtenirBloc(
                                              this.grilleAEnvoyer, this.derniereCase[0], this.derniereCase[1]));

     if (!ligneEstValide){
       this.validiteLignes[this.derniereCase[0]] = ERRONNEE;
     }
     else{this.validiteLignes[this.derniereCase[0]] = VALIDE; }

     if (!colonneEstValide){
       this.validiteColonnes[this.derniereCase[1]] = ERRONNEE;
     }
     else{this.validiteColonnes[this.derniereCase[1]] = VALIDE; }

     if (!sousGrilleEstValide){
       this.validiteSousGrille[this.trouverPositionSousGrille(this.derniereCase[0], this.derniereCase[1])] = ERRONNEE;
     }

     else{
       this.validiteSousGrille[this.trouverPositionSousGrille(this.derniereCase[0], this.derniereCase[1])] = VALIDE;
     }

     return (ligneEstValide && colonneEstValide && sousGrilleEstValide);
  }

  surSelectionCase(i: number, j: number): void{
    this.derniereCase = [i, j];
  }
  reinitialiserPartie() : void {
    this.grilleAEnvoyer = copy(this.grilleTrous);

    this.validiteLignes.fill(VALIDE);
    this.validiteColonnes.fill(VALIDE);
    this.validiteSousGrille.fill(VALIDE);
}

}

function copy(arr: any){
    let newArr = arr.slice(0);
    for (let i = newArr.length; i--; ){
        if (newArr[i] instanceof Array){
            newArr[i] = copy(newArr[i]);
        }
    }
    return newArr;
}
