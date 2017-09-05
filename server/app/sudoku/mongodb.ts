import {Sudoku} from './sudoku';
import * as mongoose from 'mongoose';
import { Score } from './../score';
import { Time } from './../time';

const FACILE = true;
const DIFFICILE = false;

const minute: number = 60 * 100;
const heure: number = minute * 60;

const temps1: Time = new Time(20 * minute);
const temps2: Time = new Time(40 * minute);
const temps3: Time = new Time(2 * heure);

temps1.update(20 * minute);
temps2.update(40 * minute);
temps3.update(2 * heure);

export const LISTESCORESNORMAL: Score[] = [
  {nomJoueur: 'saad', temps: temps1},
  {nomJoueur: 'JohnDoe222', temps: temps2},
  {nomJoueur: 'JohnDoe333', temps: temps3},

];

export const LISTESCORESDIFFICILE: Score[] = [
  {nomJoueur: 'Doe', temps: temps1},
  {nomJoueur: 'JohnDoe22', temps: temps2},
  {nomJoueur: 'JohnDoe33', temps: temps3},

];


export class MongoDB {
    //private urldb : string = 'mongodb://INF2990-13:GL04FB65@parapluie.lerb.polymtl.ca:27017/INF2990-13-db';
    private urldb = 'mongodb://olsam2:projet02@ds161099.mlab.com:61099/inf2990-13-mongodb';
    private db : mongoose.Connection;

    private sudokuSchema = new mongoose.Schema({
        grilleComplete : [[Number]],
        grilleIncomplete : [[Number]]
    });
    private scoreSchema = new mongoose.Schema({
        nom : String,
        tempsSecondes : Number,
    });

    //var de test
    private nbSudokuFacile : number;

    private highscoreFacile = mongoose.model('highscoreFacile', this.scoreSchema);
    private highscoreDifficile = mongoose.model('highscoreDifficile', this.scoreSchema);
    private sudokuFacile = mongoose.model('SudokuFacile', this.sudokuSchema);
    private sudokuDifficile = mongoose.model('SudokuDifficile', this.sudokuSchema);

    constructor (){
        this.nbSudokuFacile = 0;
        mongoose.connect(this.urldb);
        this.db = mongoose.connection;
        this.init();
    }

    premiereInsertionSudokuFacile() : boolean {
        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', () => {
            let sudoku : Sudoku = new Sudoku();
            sudoku.fill();
            sudoku.setDifficulte(FACILE);
            sudoku.generateIncompleteSudoku();

            let sudokudb = new this.sudokuFacile({grilleComplete : sudoku.grilleComplete,
                grilleIncomplete : sudoku.grilleIncomplete});

            sudokudb.save((err, grille) => {
                this.sudokuFacile.find((error, sudokus : mongoose.Document[]) => {
                    if (err) {return console.error(err); }
                    else {console.log("Insertion reussie"); }
                });
            });
        });
        return true;
    }

    insertSudokuFacile() : boolean {
        this.db.on('error', console.error.bind(console, 'connection error:'));
            let sudoku : Sudoku = new Sudoku();
            sudoku.fill();
            sudoku.setDifficulte(FACILE);
            sudoku.generateIncompleteSudoku();
           // console.log(sudoku.grilleComplete);

            let sudokudb = new this.sudokuFacile({grilleComplete : sudoku.grilleComplete,
                grilleIncomplete : sudoku.grilleIncomplete});

            sudokudb.save((err, grille) => {
                this.sudokuFacile.find((error , sudokus : mongoose.Document[]) => {
                    if (err) {return console.error(err); }
                    else {console.log("Insertion reussie"); }
                });
            });
        return true;
    }

    premiereInsertionSudokuDifficile() : boolean {
        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', () => {
            let sudoku : Sudoku = new Sudoku();
            sudoku.fill();
            sudoku.setDifficulte(DIFFICILE);
            sudoku.generateIncompleteSudoku();
            let sudokudb = new this.sudokuDifficile({grilleComplete : sudoku.grilleComplete,
                grilleIncomplete : sudoku.grilleIncomplete});

            sudokudb.save((err, grille) => {
                this.sudokuDifficile.find((error , sudokus : mongoose.Document[]) => {
                    if (err) {return console.error(err); }
                    else {console.log("Insertion reussie"); }
                });
            });
        });
        return true;
 }

     insertSudokuDificile() : boolean {
        this.db.on('error', console.error.bind(console, 'connection error:'));
            let sudoku : Sudoku = new Sudoku();
            sudoku.fill();
            sudoku.setDifficulte(DIFFICILE);
            sudoku.generateIncompleteSudoku();
            let sudokudb = new this.sudokuDifficile({grilleComplete : sudoku.grilleComplete,
                grilleIncomplete : sudoku.grilleIncomplete});

            sudokudb.save((err, grille) => {
                this.sudokuDifficile.find((error , sudokus : mongoose.Document[]) => {
                    if (err) {return console.error(err); }
                    else {console.log("Insertion reussie"); }
                });
        });
        return true;
 }


     insertScoresFacile(scores: Score[]): boolean {
        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', () => {

            let usager1 = new this.highscoreFacile({ nom: scores[0].nomJoueur,
                tempsSecondes: scores[0].temps.timeCounter });
            let usager2 = new this.highscoreFacile({ nom: scores[1].nomJoueur,
                tempsSecondes: scores[1].temps.timeCounter });
            let usager3 = new this.highscoreFacile({ nom: scores[2].nomJoueur,
                tempsSecondes: scores[2].temps.timeCounter });
            usager1.save((err, fluffy) => {
                if (err) {
                    return console.error(err);
                }
            });
            usager2.save((err, fluffy) => {
                if (err) {
                    return console.error(err);
                }
            });
            usager3.save((err, fluffy) => {
                if (err) {
                    return console.error(err);
                }
            });
        });
        return true;
    }

     insertScoresDifficile(scores: Score[]): boolean {
        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', () => {

            let usager1 = new this.highscoreDifficile({ nom: scores[0].nomJoueur,
                tempsSecondes: scores[0].temps.timeCounter });
            let usager2 = new this.highscoreDifficile({ nom: scores[1].nomJoueur,
                tempsSecondes: scores[1].temps.timeCounter });
            let usager3 = new this.highscoreDifficile({ nom: scores[2].nomJoueur,
                tempsSecondes: scores[2].temps.timeCounter });
            usager1.save((err, fluffy) => {
                if (err) {
                    return console.error(err);
                }
            });
            usager2.save((err, fluffy) => {
                if (err) {
                    return console.error(err);
                }
            });
            usager3.save((err, fluffy) => {
                if (err) {
                    return console.error(err);
                }
            });
        });
        return true;
    }

    deleteScoresFacile() : boolean {
        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', () => {
            this.highscoreFacile.find().remove().exec();
        });
        return true;
    }

    deleteScoresDifficile() : boolean {
        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', () => {
            this.highscoreDifficile.find().remove().exec();
        });
        return true;
    }

    deleteSudokuFacile() : boolean {
        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', () => {
            this.sudokuFacile.find().remove().exec();
            console.log("Sudoku facile deleted");
        });
        return true;
    }

    deleteSudokuDifficile() : boolean {
        this.db.on('error', () => {
            console.log("Erreur lors de la suppression");
            return false;
        });
        this.sudokuDifficile.find().remove().exec();
        console.log("Sudoku difficile deleted");
        return true;
    }

    getSudokudb(diffuculte : boolean) : Promise<Sudoku> {
        return new Promise<Sudoku>((resolve, reject) => {
            this.db.on('error', () => {
                console.log("Fetch impossible");
                reject();
            });
            console.log("Fetch en cours ...");
            if (diffuculte === FACILE) {
            let promise = this.sudokuFacile.findOneAndRemove().exec((err , sudokudb : Sudoku) => {
                if (err) {return console.error(err); }
                console.log(sudokudb);
                resolve(sudokudb);
            });
            promise.then((sudokudb) => { this.insertSudokuFacile(); });
            }
            else if (diffuculte === DIFFICILE) {
            let promise = this.sudokuDifficile.findOneAndRemove().exec((err , sudokudb : Sudoku) => {
                if (err) {return console.error(err); }
                console.log(sudokudb);
                resolve(sudokudb);
            });
            promise.then((sudokudb) => { this.insertSudokuDificile(); });
            }
        });
    }

    getScoresDB(diffuculte: boolean) : Promise<Score[]>{
        return new Promise<Score[]>((resolve, reject) => {
            this.db.on('error', () => {
                console.log("Fetch impossible");
                reject();
            });
            console.log("Fetch en cours ...");
            if (diffuculte === FACILE) {
            /*let promise = */ this.highscoreFacile.find().exec((err , scores : Score[]) => {
                if (err) {return console.error(err); }
                console.log(scores);
                resolve(scores);
            });
            }
            else if (diffuculte === DIFFICILE) {
             /*let promise = */this.highscoreDifficile.find().exec((err , scores : Score[]) => {
                if (err) {return console.error(err); }
                console.log(scores);
                resolve(scores);
            });
            }
        });
    }

    init() : Promise<void> {
        return new Promise<void>(resolve => {
            this.deleteSudokuFacile();
            this.premiereInsertionSudokuFacile();
            this.premiereInsertionSudokuFacile();
            this.premiereInsertionSudokuFacile();

            this.deleteSudokuDifficile();
            this.premiereInsertionSudokuDifficile();
            this.premiereInsertionSudokuDifficile();
            this.premiereInsertionSudokuDifficile();

            console.log("Initialisation complete");
        });
     }

    initScoresDefaut() : Promise<void> {
        return new Promise<void>(resolve => {
            this.insertScoresFacile(LISTESCORESNORMAL);
            console.log("sallo");
            this.insertScoresDifficile(LISTESCORESDIFFICILE);


        });
     }

     show() : boolean {
        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', () => {
            this.sudokuDifficile.find().exec((err , sudokudb : mongoose.Document[]) => {
                if (err) {return console.error(err); }
                else {console.log(sudokudb); }
            });
            this.sudokuFacile.find().exec((err , sudokudb : mongoose.Document[]) => {
                if (err) {return console.error(err); }
                else {console.log(sudokudb); }
            });

        });
        return true;
     }
}
