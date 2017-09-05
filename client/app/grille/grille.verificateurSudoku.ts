const TAILLEBLOC = 9;

export class VerificateurSudoku {

 verifierBlocValide(bloc: number[]) : boolean {
        let possibilite : Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (let i = 0; i < TAILLEBLOC; i++) {
            if ( bloc[i] !== null){
                if (possibilite.indexOf(bloc[i]) !== -1) {
                    possibilite.splice(possibilite.indexOf(bloc[i]), 1);
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }

}
