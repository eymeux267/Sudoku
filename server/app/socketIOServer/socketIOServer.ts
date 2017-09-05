import { Sudoku} from './../sudoku/sudoku';
import { MongoDB } from './../sudoku/mongodb';
import { Score } from './../score';

export class SocketIOServer {
    private io : SocketIO.Server;
    private mongodb : MongoDB;
    private grilleComplete : number[][];

    constructor(serverio : SocketIO.Server){
        this.io = serverio;
        this.mongodb = new MongoDB;
        this.grilleComplete = [];
        this.io.on('connection', (socket) => {
            console.log("User : " + socket.id + " connected");
            this.listenToUserRequests(socket);
            socket.on('disconnect', () => {
                console.log("User : " + socket.id + " disconnected");
            });
        });
    }

    listenToUserRequests(socket : SocketIO.Socket) {
        socket.on('request-sudoku', (difficulte : boolean) => {
            this.mongodb.getSudokudb(difficulte).then((sudokudb : Sudoku) => {
                socket.emit('grille-incomplete', sudokudb.grilleIncomplete);
                this.grilleComplete = sudokudb.grilleComplete;
                console.log("Sudoku envoye a partir de la db");
                this.mongodb.show();
            })
            .catch(() => {
                // Grille de remplacement
                const GRILLETOSUBMIT : number[][] = [
                    [null, null, 3, 4, null, 6, 7, 8, 9 ],
                    [4, 5, 6, null, 8, 9, 1, null, 3],
                    [7, 8, null, 1, 2, null, 4, 5, null],
                    [null, 3, 4, 5, 6, 7, 8, 9, 1],
                    [5, null, 7, null, null, 1, null, 3, 4],
                    [8, 9, 1, 2, 3, null, 5, 6, null],
                    [3, null, 5, 6, null, 8, null, 1, 2],
                    [null, 7, 8, null, 1, 2, 3, 4, 5],
                    [null, 1, 2, 3, null, 5, 6, 7, 8 ],
                ];
                const GRILLE: number[][] = [ // Ceci est la Grille original avec les reponses. (C'est le "corrige")
                    [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    [4, 5, 6, 7, 8, 9, 1, 2, 3],
                    [7, 8, 9, 1, 2, 3, 4, 5, 6],
                    [2, 3, 4, 5, 6, 7, 8, 9, 1],
                    [5, 6, 7, 8, 9, 1, 2, 3, 4],
                    [8, 9, 1, 2, 3, 4, 5, 6, 7],
                    [3, 4, 5, 6, 7, 8, 9, 1, 2],
                    [6, 7, 8, 9, 1, 2, 3, 4, 5],
                    [9, 1, 2, 3, 4, 5, 6, 7, 8],
                ];
                socket.emit('grille-incomplete', GRILLETOSUBMIT);
                this.grilleComplete = GRILLE;
                console.log("Sudoku de remplacement envoye");
            });
        });
        this.validateSudoku(socket);
    }

    listenToScoreReq(socket : SocketIO.Socket){
         socket.on('request-scores', (difficulte : boolean) => {
            this.mongodb.getScoresDB(difficulte).then((scoredb : Score[]) => {
                socket.emit('tableau-scores', scoredb);
                console.log("score envoye a partir de la db");
            });
      });
}

    validateSudoku(socket : SocketIO.Socket) : void {
        let isValid = true;
        console.log("Voici la grille complete : " + this.grilleComplete);
        socket.on('validate-sudoku', (grilleToValidate : number[][]) => {
            console.log("Voici grille a valider : " + grilleToValidate);
            for (let i = 0; i < grilleToValidate.length; i++) {
                for (let j = 0; j < grilleToValidate[i].length; j++) {
                    if (grilleToValidate[i][j] !== this.grilleComplete[i][j]) {
                        isValid = false;
                    }
                }
            }
            console.log(isValid);
            socket.emit('validation', isValid);
        });
    }

    work(){
        // salut.
    }
}

/*
// Socket.io cheat sheet
// sending to sender-client only
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
socket.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
socket.broadcast.to(socketid).emit('message', 'for your eyes only');
*/
