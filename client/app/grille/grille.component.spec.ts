import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { spy } from 'sinon';
import { GrilleComponent } from './grille.component';
import { GrilleService } from './grille.service';
import { expect } from 'chai';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const grille : number[][] = [
        [null, null, 3, 4, null, 6, 7, 8, 9 ],
        [4, 5, 6, null, 8, 9, 1, null, 3],
        [7, 8, null, 1, 2, null, 4, 5, null],
        [null, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, null, 7, null, null, 1, null, 3, 4],
        [8, 9, 1, 2, 3, null, 5, 6, null],
        [3, null, 5, 6, null, 8, null, 1, 2],
        [null, 7, 8, null, 1, 2, 3, 4, 5],
        [null, 1, 2, 3, null, 5, 6, 7, 8 ]
        ];
const grillePresqueRemplie : number[][] = [
        [null, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8], ] ;

const GAUCHE = 37;
const HAUT = 38;
const DROITE = 39;
const BAS = 40;
const SUPPRIMER = 46;
const NORMALE = false;
const DIFFICILE = true;

describe('GrilleComponent (templateUrl)', () => {

  let comp: GrilleComponent;
  let fixture: ComponentFixture<GrilleComponent>;

  let grilleServiceStub = {
    getSudoku: function(difficulte: boolean): Promise<number[][]>{
      return new Promise<number[][]>((resolve) => {
        resolve(grille);
      } );
    },
    verifierGrilleEstCorrecte: function(grilleAEnvoyer: number[][]): Promise<boolean>{
      return new Promise<boolean>((resolve) => {
        resolve(true);
      } );
    }
  };

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
        schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
       declarations: [ GrilleComponent ],
       providers:    [ {provide: GrilleService, useValue: grilleServiceStub } ]
    })
    .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {

    fixture = TestBed.createComponent(GrilleComponent);
    comp = fixture.componentInstance;
    require("chai").use(require("sinon-chai"));

  });

  it(`Il est possible d'appeler grilleService.getSudoku() a partie du component et il retourne
        le sudoku`, () => {
      fixture.detectChanges();
      comp.difficulte = true;
      comp.grilleService.getSudoku(true).then((sudoku : number[][]) => {
      expect(sudoku).to.be.equal(grille);
      comp.grilleAEnvoyer = copy(sudoku);
      comp.grilleTrous = copy(sudoku); });
      fixture.detectChanges();
  });

    it(`Si on change grilleAEnvoyer, lecran affiche la nouvelle grille`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grille);
      comp.grilleTrous = copy(grille);

      fixture.detectChanges();

      // les chiffres du sudokus sont contenus dans des labels.
      let debug = fixture.debugElement.queryAll(By.css('label'));
      let tableauLabels: HTMLElement[] = [];

      expect(debug.length).to.be.equal(81); // toujours 81 elements dans le tableau. 9x9

      for (let i = 0; i < debug.length; i++){
        tableauLabels.push(debug[i].nativeElement);
      }

      for (let i = 0; i < grille.length; i++){
        for (let j = 0; j < grille.length; j++){
          let posTableauLabels = (i * grille.length) + j;
          if (grille[i][j] !== null){
            expect(tableauLabels[posTableauLabels].innerText).to.be.equal(String(grille[i][j]));
            expect(tableauLabels[posTableauLabels].innerText).to.be.equal(String(comp.grilleAEnvoyer[i][j]));
          }
          else if (grille[i][j] === null){
            expect(tableauLabels[posTableauLabels].innerText).to.be.equal("");
          }
        }
     }

  });

  it(`Seulement la derniere case selectionnee est surlignee en jaune`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grille);
      comp.grilleTrous = copy(grille);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();

      let debug = fixture.debugElement.queryAll(By.css('label'));
      let tableauDivsGrille: HTMLElement[] = [];
      for (let i = 0; i < debug.length; i++){
        tableauDivsGrille.push(debug[i].parent.nativeElement);
      }
      expect(tableauDivsGrille[0].classList.contains("surligneeEnJaune")).to.be.equal(true);

      comp.derniereCase = [4, 3];
      fixture.detectChanges();
      expect(tableauDivsGrille[0].classList.contains("surligneeEnJaune")).to.be.equal(false);
      let positionTableau = 4 * grille.length + 3;
      expect(tableauDivsGrille[positionTableau].classList.contains("surligneeEnJaune")).to.be.equal(true);

      comp.derniereCase = [8, 8];
      fixture.detectChanges();
      expect(tableauDivsGrille[positionTableau].classList.contains("surligneeEnJaune")).to.be.equal(false);
      positionTableau = 8 * grille.length + 8;
      expect(tableauDivsGrille[positionTableau].classList.contains("surligneeEnJaune")).to.be.equal(true);

  });

    it(`Appuyer les fleches du clavier change la derniere case selectionnee correctement`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grille);
      comp.grilleTrous = copy(grille);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();

      let debugGrille = fixture.debugElement.query(By.css('.grille'));
      debugGrille.triggerEventHandler('keydown', {keyCode: DROITE}); // appuie la fleche droite.
      fixture.detectChanges();

      expect(comp.derniereCase).to.deep.equal([0, 1]);
      // Appuie la fleche bas 2 fois.
      debugGrille.triggerEventHandler('keydown', {keyCode: BAS});
      debugGrille.triggerEventHandler('keydown', {keyCode: BAS});
      fixture.detectChanges();

      expect(comp.derniereCase).to.deep.equal([2, 1]);

      debugGrille.triggerEventHandler('keydown', {keyCode: GAUCHE});
      fixture.detectChanges();
      expect(comp.derniereCase).to.deep.equal([2, 0]);

      debugGrille.triggerEventHandler('keydown', {keyCode: HAUT});
      debugGrille.triggerEventHandler('keydown', {keyCode: HAUT});
      fixture.detectChanges();
      expect(comp.derniereCase).to.deep.equal([0, 0]);
  });

      it(`Appuyer les fleches du clavier change la derniere case selectionnee correctement
          lorsquon est a une extremite de la grille.`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grille);
      comp.grilleTrous = copy(grille);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();

      let debugGrille = fixture.debugElement.query(By.css('.grille'));
      debugGrille.triggerEventHandler('keydown', {keyCode: GAUCHE});
      fixture.detectChanges();
      expect(comp.derniereCase).to.deep.equal([0, 8]);

      debugGrille.triggerEventHandler('keydown', {keyCode: HAUT});
      fixture.detectChanges();
      expect(comp.derniereCase).to.deep.equal([8, 8]);

      debugGrille.triggerEventHandler('keydown', {keyCode: DROITE});
      fixture.detectChanges();
      expect(comp.derniereCase).to.deep.equal([8, 0]);

      debugGrille.triggerEventHandler('keydown', {keyCode: BAS});
      fixture.detectChanges();
      expect(comp.derniereCase).to.deep.equal([0, 0]);

  });

   it(`Ajouter un chiffre a la grille a laide du clavier`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grille);
      comp.grilleTrous = copy(grille);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();

      let debugGrille = fixture.debugElement.query(By.css('.grille'));
      debugGrille.triggerEventHandler('keyup', {keyCode: 51}); // Appuie la touche 3 sur son clavier.
      fixture.detectChanges();

      comp.derniereCase = [4, 4];
      fixture.detectChanges();
      debugGrille.triggerEventHandler('keyup', {keyCode: 53}); // Appuie la touche 5 sur son clavier.
      fixture.detectChanges();

      expect(comp.grilleAEnvoyer[0][0]).to.be.equal(3);
      expect(comp.grilleAEnvoyer[4][4]).to.be.equal(5);

      expect(comp.grilleTrous[0][0]).to.be.equal(null);
      expect(comp.grilleTrous[4][4]).to.be.equal(null);

      console.log(comp.grilleTrous);

  });

     it(`Essayer d'ajouter un caractere invalide de la grille (pas entre 0 et 9) ne marche pas`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grille);
      comp.grilleTrous = copy(grille);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();

      let debugGrille = fixture.debugElement.query(By.css('.grille'));
      debugGrille.triggerEventHandler('keyup', {keyCode: 65}); // appuie sur la touche a.
      fixture.detectChanges();
      expect(comp.grilleAEnvoyer[0][0]).to.be.equal(null);

      debugGrille.triggerEventHandler('keyup', {keyCode: 186}); // appuie sur point-virgule.
      fixture.detectChanges();
      expect(comp.grilleAEnvoyer[0][0]).to.be.equal(null);

    });

    it(`Appuyer sur la touche delete efface la lettre dans la derniere case selectionnee`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grille);
      comp.grilleTrous = copy(grille);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();

      let debugGrille = fixture.debugElement.query(By.css('.grille'));
      debugGrille.triggerEventHandler('keyup', {keyCode: 51}); // appuie sur la touche 3.
      fixture.detectChanges();
      expect(comp.grilleAEnvoyer[0][0]).to.be.equal(3);

      debugGrille.triggerEventHandler('keydown', {keyCode: SUPPRIMER});
      fixture.detectChanges();
      expect(comp.grilleAEnvoyer[0][0]).to.be.equal(null);
    });

    it(`Verification immediate des 3 conditions de validite d'un sudoku a chaque fois quon entre ou enleve une
        enleve un chiffre de la grille (Cas entree valide: le chiffre est en vert)`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grille);
      comp.grilleTrous = copy(grille);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();

      let debugGrille = fixture.debugElement.query(By.css('.grille'));
      debugGrille.triggerEventHandler('keyup', {keyCode: 49}); // appuie sur la touche 1.
      fixture.detectChanges();
      debugGrille.triggerEventHandler('keydown', {keyCode: DROITE});
      debugGrille.triggerEventHandler('keyup', {keyCode: 50}); // appuie sur la touche 2.
      fixture.detectChanges();

      let debug = fixture.debugElement.queryAll(By.css('label'));
      let tableauLabelsGrille: HTMLElement[] = [];
      for (let i = 0; i < debug.length; i++){
        tableauLabelsGrille.push(debug[i].parent.nativeElement);
      }

      // Case blanche affiche la lettre en vert.
      expect(tableauLabelsGrille[0].classList.contains("caseBlanche")).to.be.equal(true);
      // Le caractere n'est pas en rouge car lentree respecte les conditions de verification.
      expect(tableauLabelsGrille[0].classList.contains("caracteresEnRouge")).to.be.equal(false);

      expect(tableauLabelsGrille[1].classList.contains("caseBlanche")).to.be.equal(true);
      expect(tableauLabelsGrille[1].classList.contains("caracteresEnRouge")).to.be.equal(false);
    });

        it(`Verification immediate des 3 conditions de validite d'un sudoku a chaque fois quon entre ou enleve une
          enleve un chiffre de la grille (Cas ligne invalide)`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grille);
      comp.grilleTrous = copy(grille);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();
      let debugGrille = fixture.debugElement.query(By.css('.grille'));

      let debug = fixture.debugElement.queryAll(By.css('label'));
      let tableauDivsGrille: HTMLElement[] = [];
      for (let i = 0; i < debug.length; i++){
        tableauDivsGrille.push(debug[i].nativeElement);
      }

      debugGrille.triggerEventHandler('keyup', {keyCode: 51}); // appuie sur la touche 3 (ligne invalide).
      fixture.detectChanges();
      for (let i = 0; i < comp.grilleAEnvoyer.length; i++) // Verifie que la ligne a des caracteres rouges.
      {
          expect(tableauDivsGrille[i].classList.contains("caracteresEnRouge")).to.be.equal(true);
      }

      debugGrille.triggerEventHandler('keydown', {keyCode: SUPPRIMER});
      fixture.detectChanges();
      for (let i = 0; i < comp.grilleAEnvoyer.length; i++) // Verifie que la ligne nest plus en rouge.
      {
          expect(tableauDivsGrille[i].classList.contains("caracteresEnRouge")).to.be.equal(false);
      }

      // Meme test mais sur la ligne 3.
      comp.derniereCase = [3, 0];
      fixture.detectChanges();
      debugGrille.triggerEventHandler('keyup', {keyCode: 56}); // appuie sur la touche 8 (ligne invalide).
      fixture.detectChanges();
      let positionDebut = comp.grilleAEnvoyer.length * 3;
      // Verifie que la ligne a des caracteres rouges.
      for (let i = positionDebut; i < positionDebut + comp.grilleAEnvoyer.length; i++)
      {
          expect(tableauDivsGrille[i].classList.contains("caracteresEnRouge")).to.be.equal(true);
      }
      debugGrille.triggerEventHandler('keydown', {keyCode: SUPPRIMER});
      fixture.detectChanges();
      for (let i = positionDebut; i < positionDebut + comp.grilleAEnvoyer.length; i++)
      {
          expect(tableauDivsGrille[i].classList.contains("caracteresEnRouge")).to.be.equal(false);
      }

    });

     it(`Verification immediate des 3 conditions de validite d'un sudoku a chaque fois quon entre ou enleve une
          enleve un chiffre de la grille (Cas colonne invalide)`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grille);
      comp.grilleTrous = copy(grille);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();
      let debugGrille = fixture.debugElement.query(By.css('.grille'));

      let debug = fixture.debugElement.queryAll(By.css('label'));
      let tableauDivsGrille: HTMLElement[] = [];
      for (let i = 0; i < debug.length; i++){
        tableauDivsGrille.push(debug[i].nativeElement);
      }

      debugGrille.triggerEventHandler('keyup', {keyCode: 56}); // appuie sur la touche 8 (colonne invalide).
      fixture.detectChanges();
      for (let i = 0; i < comp.grilleAEnvoyer.length; i++ ) // Verifie que la colonne a des caracteres rouges.
      {
          let positionProchaineLigne = i * 9;
          expect(tableauDivsGrille[positionProchaineLigne].classList.contains("caracteresEnRouge")).to.be.equal(true);
      }
      debugGrille.triggerEventHandler('keydown', {keyCode: SUPPRIMER});
      fixture.detectChanges();
      for (let i = 0; i < comp.grilleAEnvoyer.length; i++) // Verifie que la colonne nest plus en rouge.
      {
        let positionProchaineLigne = i * 9;
        expect(tableauDivsGrille[positionProchaineLigne].classList.contains("caracteresEnRouge")).to.be.equal(false);
      }

      // Meme test mais sur la colonne 4.
      comp.derniereCase = [0, 4];
      fixture.detectChanges();
      debugGrille.triggerEventHandler('keyup', {keyCode: 56}); // appuie sur la touche 8 (ligne invalide).
      fixture.detectChanges();
      let positionDebut = comp.derniereCase[1];
      // Verifie que la ligne a des caracteres rouges.
      for (let i = 0; i < comp.grilleAEnvoyer.length; i++)
      {
          let positionProchaineLigne = (i * 9) + positionDebut;
          expect(tableauDivsGrille[positionProchaineLigne].classList.contains("caracteresEnRouge")).to.be.equal(true);
      }
      debugGrille.triggerEventHandler('keydown', {keyCode: SUPPRIMER});
      fixture.detectChanges();
      for (let i = 0; i < comp.grilleAEnvoyer.length; i++)
      {
          let positionProchaineLigne = (i * 9) + positionDebut;
          expect(tableauDivsGrille[positionProchaineLigne].classList.contains("caracteresEnRouge")).to.be.equal(false);
      }

    });

     it(`Verification immediate des 3 conditions de validite d'un sudoku a chaque fois quon entre ou enleve une
          enleve un chiffre de la grille (Cas bloc invalide)`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grille);
      comp.grilleTrous = copy(grille);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();
      let debugGrille = fixture.debugElement.query(By.css('.grille'));

      let debug = fixture.debugElement.queryAll(By.css('label'));
      let tableauDivsGrille: HTMLElement[] = [];
      for (let i = 0; i < debug.length; i++){
        tableauDivsGrille.push(debug[i].nativeElement);
      }

      debugGrille.triggerEventHandler('keyup', {keyCode: 53}); // appuie sur la touche 5 (bloc invalide).
      fixture.detectChanges();
      for (let i = 0; i < 3; i++ ) // Verifie que le bloc 3x3 a des caracteres rouges.
      {
        for (let j = 0; j < 3; j++){
          let pos = j + (i * 9);
          expect(tableauDivsGrille[pos].classList.contains("caracteresEnRouge")).to.be.equal(true);
        }
      }
      debugGrille.triggerEventHandler('keydown', {keyCode: SUPPRIMER});
      fixture.detectChanges();
      for (let i = 0; i < 3; i++) // Verifie que le bloc 3x3 nest plus en rouge.
      {
        for (let j = 0; j < 3; j++){
          let pos = j + (i * 9);
          expect(tableauDivsGrille[pos].classList.contains("caracteresEnRouge")).to.be.equal(false);
        }
      }

    });

     it(`Si la grille n'est pas remplie ou que les conditions ne sont pas respectees,
             la fonction comparerGrilleAvecCorrige() n'est pas lancee`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grille);
      comp.grilleTrous = copy(grille);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();
      let debugGrille = fixture.debugElement.query(By.css('.grille'));
      let espion = spy(comp, 'comparerGrilleAvecCorrige');

      fixture.detectChanges();

      debugGrille.triggerEventHandler('keyup', {keyCode: 49}); // appuie sur la touche 1
      fixture.detectChanges();
      expect(espion).to.not.have.been.called;

      comp.derniereCase = [4, 4];
      debugGrille.triggerEventHandler('keyup', {keyCode: 49}); // appuie sur la touche 1
      fixture.detectChanges();
      expect(espion).to.not.have.been.called;

      comp.grilleAEnvoyer = copy(grillePresqueRemplie);
      comp.grilleTrous = copy(grillePresqueRemplie);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();
      debugGrille.triggerEventHandler('keyup', {keyCode: 50}); // appuie sur la touche 2 (grille invalide)
      fixture.detectChanges();
      expect(espion).to.not.have.been.called;

    });

      it(`Si la grille est remplie et que les conditions sont validees, le componenet compare avec le corrige
            sur le serveur`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grillePresqueRemplie);
      comp.grilleTrous = copy(grillePresqueRemplie);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();
      let debugGrille = fixture.debugElement.query(By.css('.grille'));
      let espion = spy(comp, 'comparerGrilleAvecCorrige');

      fixture.detectChanges();

      debugGrille.triggerEventHandler('keyup', {keyCode: 49}); // appuie sur la touche 1
      fixture.detectChanges();
      expect(espion).to.have.been.called;

    });

     it(`Demande dun nouveau sudoku facile est lancee si on appuie sur le bouton`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grillePresqueRemplie);
      comp.grilleTrous = copy(grillePresqueRemplie);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();
      let espion = spy(comp, 'requeteNouvelleGrille');
      let debugBoutonFacile = fixture.debugElement.query(By.css('#boutonNormale'));
      debugBoutonFacile.triggerEventHandler('click', { button: 0 });

      fixture.detectChanges();
      expect(espion).to.have.been.calledWith(NORMALE);

    });

    it(`Demande dun nouveau sudoku difficile est lancee si on appuie sur le bouton`, () => {
      fixture.detectChanges();
      comp.grilleAEnvoyer = copy(grillePresqueRemplie);
      comp.grilleTrous = copy(grillePresqueRemplie);
      comp.derniereCase = [0, 0];
      fixture.detectChanges();
      let espion = spy(comp, 'requeteNouvelleGrille');
      let debugBoutonFacile = fixture.debugElement.query(By.css('#boutonDifficile'));
      debugBoutonFacile.triggerEventHandler('click', { button: 0 });

      fixture.detectChanges();
      expect(espion).to.have.been.calledWith(DIFFICILE);

    });


});

function copy(arr: any){
    let newArr = arr.slice(0);
    for (let i = newArr.length; i--; ){
        if (newArr[i] instanceof Array){
            newArr[i] = copy(newArr[i]);
        }
    }
    return newArr;
}
