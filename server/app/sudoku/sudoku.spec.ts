import { expect } from 'chai';
import { Sudoku } from './sudoku';
import { Pos } from './pos';
const NORMALE = true;
const DIFFICILE = false;

describe('Sudoku' , () => {

it(`La methode fill() devrait toujours generer grille 9x9`, () => {
     let sudoku: Sudoku = new Sudoku();
     let grilleGeneree: number[][];
     sudoku.fill();
     grilleGeneree = sudoku.getGrilleComplete();
     expect(grilleGeneree.length).to.be.equal(9);
     for (let i of grilleGeneree){
         expect(i.length).to.be.equal(9);
     }
  });

it(`Les methodes fill() et getGrilleComplete() ne retournent case vide`, () => {
     let sudoku: Sudoku = new Sudoku();
     let grilleGeneree: number[][];
     sudoku.fill();
     grilleGeneree = sudoku.getGrilleComplete();
     for (let i = 0; i < grilleGeneree.length; i++){
         for (let j = 0; j < grilleGeneree.length; j++){
             expect(grilleGeneree[i][j]).to.not.be.null;
         }
     }
  });

it(`Si on demande de generer un sudoku difficile, il devrait y avoir environ 35 cases vides`, () => {
     let sudoku: Sudoku = new Sudoku();
     let grilleGeneree: number[][];
     sudoku.fill();
     sudoku.setDifficulte(DIFFICILE);
     sudoku.generateIncompleteSudoku();
     grilleGeneree = sudoku.grilleIncomplete;
     let nbrCasesVides = 0;
     for (let i = 0; i < grilleGeneree.length; i++){
        for (let j = 0; j < grilleGeneree.length; j++){
             if (grilleGeneree[i][j] === null){
                 nbrCasesVides++;
             }
         }
     }
     expect(nbrCasesVides).to.be.within(31, 35);
  });

it(`Si on demande de generer un sudoku normal, il devrait y avoir 25 cases vides`, () => {
     let sudoku: Sudoku = new Sudoku();
     let grilleGeneree: number[][];
     sudoku.fill();
     sudoku.setDifficulte(NORMALE);
     sudoku.generateIncompleteSudoku();
     grilleGeneree = sudoku.grilleIncomplete;
     let nbrCasesVides = 0;
     for (let i = 0; i < grilleGeneree.length; i++){
        for (let j = 0; j < grilleGeneree.length; j++){
             if (grilleGeneree[i][j] === null){
                 nbrCasesVides++;
             }
         }
     }
     expect(nbrCasesVides).to.be.equal(25);
  });

it(`Methode getBlocStart() fonctionne bien`, () => {
     let sudoku: Sudoku = new Sudoku();
     let pos: Pos = new Pos(5, 5);
     let posAttendue: Pos = new Pos(3, 3);
     expect(sudoku.getBlockStart(pos)).to.deep.equal(posAttendue);

    pos = new Pos(0, 0);
     posAttendue = new Pos(0, 0);
     expect(sudoku.getBlockStart(pos)).to.deep.equal(posAttendue);

     pos = new Pos(8, 8);
     posAttendue = new Pos(6, 6);
     expect(sudoku.getBlockStart(pos)).to.deep.equal(posAttendue);

     pos = new Pos(5, 1);
     posAttendue = new Pos(3, 0);
     expect(sudoku.getBlockStart(pos)).to.deep.equal(posAttendue);

  });
  it(`Methode getBlocEnd() fonctionne bien`, () => {
     let sudoku: Sudoku = new Sudoku();
     let pos: Pos = new Pos(5, 5);
     let posAttendue: Pos = new Pos(6, 6);
     expect(sudoku.getBlockEnd(pos)).to.deep.equal(posAttendue);

    pos = new Pos(0, 0);
     posAttendue = new Pos(3, 3);
     expect(sudoku.getBlockEnd(pos)).to.deep.equal(posAttendue);

     pos = new Pos(8, 8);
     posAttendue = new Pos(9, 9);
     expect(sudoku.getBlockEnd(pos)).to.deep.equal(posAttendue);

     pos = new Pos(5, 1);
     posAttendue = new Pos(6, 3);
     expect(sudoku.getBlockEnd(pos)).to.deep.equal(posAttendue);

  });

  it(`Methode resetBlock() fonctionne bien`, () => {
     let sudoku: Sudoku = new Sudoku();
     sudoku.fill();
     let pos: Pos = new Pos(5, 5);
     sudoku.resetBloc(pos);

     let start: Pos = sudoku.getBlockStart(pos);
     let end: Pos = sudoku.getBlockEnd(pos);

    for (let row = start.row; row < end.row; row++) {
            for (let col = start.col; col < end.col; col++) {
                expect(sudoku.grilleComplete[row][col]).to.be.equal(0);
            }
        }

  });


});

