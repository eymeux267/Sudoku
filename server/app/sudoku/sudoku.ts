import { Pos } from './pos';

const ROW = 9;
const COL = 9;
const BLOCK_SIZE = 3;
const NB_BLOCKS = 9;
let largestAttempts = 0;
const FACILE = true;
const DIFFICILE = false;
//Seuil d'échecs toléré lors du remplissage de la grille
const REGRESSION_THRESHOLD = 40;


/*
Sous-Grilles POS[n], n = 0 - 8

 +-----------------+
 |     |     |     |
 |  0  |  1  |  2  |
 |     |     |     |
 +-----------------+
 |     |     |     |
 |  3  |  4  |  5  |
 |     |     |     |
 +-----------------+
 |     |     |     |
 |  6  |  7  |  8  |
 |     |     |     |
 +-----------------+

(outil: http://asciiflow.com/)
*/
const POS: Pos[] = [{row : 0, col : 0},
                    {row : 0, col : 3},
                    {row : 0, col : 6},
                    {row : 3, col : 0},
                    {row : 3, col : 3},
                    {row : 3, col : 6},
                    {row : 6, col : 0},
                    {row : 6, col : 3},
                    {row : 6, col : 6},
                    ];

//pour effacer la console (npm install clear) utilisation: clear(); (un-comment pour tests)
let clear = require('clear');

export class Sudoku {
    grilleComplete : Array<Array<number>>;
    grilleIncomplete : Array<Array<number>>;
    difficulte : boolean;

    constructor() {
        this.difficulte = DIFFICILE;
        this.grilleComplete = new Array<Array<number>>(ROW);
        this.grilleIncomplete = new Array<Array<number>>(ROW);
        for (let i = 0; i < COL; i++) {
            this.grilleComplete[i] = new Array<number>(COL);
            this.grilleIncomplete[i] = new Array<number>(COL);
        }
        for (let row = 0; row < ROW; row++) {
            for (let col = 0; col < COL; col++) {
                this.grilleComplete[row][col] = 0;
            }
        }
    }

    getGrilleComplete(): number[][]{
        return this.grilleComplete;
    }
    setDifficulte(difficulte : boolean) : void {
        this.difficulte = difficulte;
    }

    getBlockStart(pos: Pos) : Pos {
        // On divise par 3(BLOCK_SIZE) en arrondissant vers le bas, ensuite * 3
        //pour trouver le 1er index des blocs (0, 3, 6)
        let startRow: number = (Math.floor(pos.row / BLOCK_SIZE)) * BLOCK_SIZE;
        let startCol: number = (Math.floor(pos.col / BLOCK_SIZE)) * BLOCK_SIZE;

        return new Pos(startRow, startCol);
    }

    getBlockEnd(pos: Pos) {
        let start: Pos = this.getBlockStart(pos);
        let endRow : number = start.row + BLOCK_SIZE;
        let endCol : number = start.col + BLOCK_SIZE;

        return new Pos(endRow, endCol);
    }

    fillBlock(pos: Pos) : boolean {

        let start: Pos = this.getBlockStart(pos);
        let end: Pos = this.getBlockEnd(pos);

        let isInsertionPossible: boolean;
        let num : number;

        for (let row = start.row; row < end.row; row++) {
            for (let col = start.col; col < end.col; col++) {
                isInsertionPossible = false;
                let posInsertion = new Pos(row, col);

                //nombre de fois où l'on a tenté d'insérer un nombre. Si > seuil, on retourne 'false'
                let attempts = 0;
                while (!isInsertionPossible) {
                    num = randomNumber();
                    this.grilleComplete[row][col] = num;

                    this.grilleComplete[row][col] = 0;
                    isInsertionPossible = this.validateInsertion(num, posInsertion);
                    attempts++;

                    //Échec du remplissage
                    if (attempts > REGRESSION_THRESHOLD){
                        return false;
                    }
                }
                largestAttempts = attempts > largestAttempts ? attempts : largestAttempts;
                this.insert(num, new Pos(row, col));
                //S'assurer de (npm install clear) et de un-comment la ligne ~38 si on veut utiliser clear()


            }
        }
        //Réussite du remplissage

        return true;
    }

    resetBloc(pos: Pos) : void {
        let start: Pos = this.getBlockStart(pos);
        let end: Pos = this.getBlockEnd(pos);


        for (let row = start.row; row < end.row; row++) {
            for (let col = start.col; col < end.col; col++) {
                this.grilleComplete[row][col] = 0;
            }
        }
    }

    fill() : boolean {
        let isBlocGenerated = false;
        //Seulement pour log, optionnel
        let regressions = 0;
        //générer blocs
        for (let i = 0; i < NB_BLOCKS; i++){
            //test avec pause, juste pour "animer" l'affichage à la console

            isBlocGenerated = this.fillBlock(POS[i]);
            //si la génération de bloc a échoué (prends trop de temps)
            if (!isBlocGenerated){
                //restaurer le bloc présent
                this.resetBloc(POS[i]);
                //régrésser
                i--;
                this.resetBloc(POS[i]);
                i--;
                //log du nombre de régressions, pour le fun
                regressions++;
            }
        }
        return true;
    }

    validateInsertion(num : number, pos: Pos) : boolean {
        let isBlockValid: boolean = this.checkBlock(num, pos);
        let isRowValid: boolean = this.checkRow(num, pos.row);
        let isColValid: boolean = this.checkCol(num, pos.col);

        return (isBlockValid && isRowValid && isColValid);
    }

    checkRow(num : number, rowIndex : number) : boolean {
        for (let col = 0; col < COL; col++) {
            if (this.grilleComplete[rowIndex][col] === num) {
                return false;
            }
        }
        return true;
    }

    checkCol(num : number, colIndex : number) : boolean {
        for (let row = 0; row < ROW; row++) {
            if (this.grilleComplete[row][colIndex] === num) {
                return false;
            }
        }
        return true;
    }

    checkBlock(num : number, pos : Pos) : boolean {
        let start : Pos = this.getBlockStart(pos);
        let end : Pos = this.getBlockEnd(pos);

        for (let row = start.row; row < end.row; row++) {
            for (let col = start.col; col < end.col; col++) {
                if (this.grilleComplete[row][col] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    insert(num : number, pos : Pos) : void {
        this.grilleComplete[pos.row][pos.col] = num;
    }


    animeLog() : void {
        clear();
        console.log();
        console.log(this.grilleComplete);

        for (let i = 0; i < 444000; i++){
            Math.acos(Math.sqrt(Math.PI));
        }
        clear();
        console.log();
    }

    animeShortLog() : void {
        clear();
        console.log();
        console.log(this.grilleComplete);

        for (let i = 0; i < 222000; i++){
            Math.acos(Math.sqrt(Math.PI));
        }
        clear();
        console.log();
    }

    determineNbCasesAEnlever() : number {
        const nbCasesFacile = 25;
        const nbCasesDifficile = 35;
        if (this.difficulte === FACILE){ return nbCasesFacile; }
        else {return nbCasesDifficile; }
    }

    generateIncompleteSudoku() : boolean {
        for (let row = 0; row < ROW; row++) {
            for (let col = 0; col < COL; col++) {
                this.grilleIncomplete[row][col] = this.grilleComplete[row][col];
            }
        }

        let nbInitMax : number = this.determineNbCasesAEnlever();
        let pos : Pos;
        let tempNum : number;

        let nbInit : number ;

            for ( nbInit = 0 ; nbInit < nbInitMax ; nbInit++){
                let isSolvable = false;
                let gardeFou = 0;
                do {
                    pos = new Pos(randomNumberArray(), randomNumberArray());
                    tempNum = this.grilleIncomplete[pos.row][pos.col];
                    if (tempNum !== null){
                        gardeFou++;
                        this.grilleIncomplete[pos.row][pos.col] = null;
                        if (!this.IsSolvalble(pos)){
                            this.grilleIncomplete[pos.row][pos.col] = tempNum;
                        }
                        else {
                            isSolvable = true; }
                    }
                }while (!isSolvable && gardeFou < 81);

        }
        return true;
    }

    IsSolvalble (pos : Pos) : boolean {
        let possibilite : Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (let col = 0; col < COL; col++) {
            for (let i = 0; i < possibilite.length; i++){
                if (this.grilleIncomplete[pos.row][col] === possibilite[i]) {
                    possibilite.splice(i, 1);
                }
            }
        }

        for (let row = 0; row < ROW; row++) {
            for (let i = 0; i < possibilite.length; i++){
                if (this.grilleIncomplete[row][pos.col] === possibilite[i]){
                    possibilite.splice(i, 1);
                }
            }
        }

        let start : Pos = this.getBlockStart(pos);
        let end : Pos = this.getBlockEnd(pos);

        for (let row = start.row; row < end.row; row++) {
            for (let col = start.col; col < end.col; col++) {
                for (let i = 0; i < possibilite.length; i++){
                    if (this.grilleIncomplete[row][col] === possibilite[i]) {
                        possibilite.splice(i, 1);
                    }
                }
            }
        }

        if (possibilite.length === 1){
            return true;
        }
        else {return false; }
    }

}

function randomNumber() : number {
    return Math.floor(Math.random() * 9) + 1;
}

function randomNumberArray() : number {
    return Math.floor(Math.random() * 9);
}


