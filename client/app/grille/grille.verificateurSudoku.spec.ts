import { expect } from 'chai';
import { VerificateurSudoku } from './grille.verificateurSudoku';

describe('VerificateurSudoku' , () => {
it(`Verifier des blocs valides. Fonction verifierBlocValide() retourne true`, () => {
      let blocAVerifier = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      let verificateur = new VerificateurSudoku;
      expect(verificateur.verifierBlocValide(blocAVerifier)).to.be.equal(true);

      blocAVerifier = [9, 8, 3, 4, 5, 6, 7, 2, 1];
      expect(verificateur.verifierBlocValide(blocAVerifier)).to.be.equal(true);

      blocAVerifier = [8, 5, 3, 4, 7, 6, 9, 2, 1];
      expect(verificateur.verifierBlocValide(blocAVerifier)).to.be.equal(true);

      blocAVerifier = [9, 8, 7, 6, 5, 4, 3, 2, 1];
      expect(verificateur.verifierBlocValide(blocAVerifier)).to.be.equal(true);
  });

it(`Verifier des blocs invalides. Fonction verifierBlocValide() retourne false`, () => {
      let blocAVerifier = [1, 2, 3, 3, 5, 6, 7, 8, 9];
      let verificateur = new VerificateurSudoku;
      expect(verificateur.verifierBlocValide(blocAVerifier)).to.be.equal(false);

      blocAVerifier = [1, 1, 1, 2, 2, 1, 1, 2, 1];
      expect(verificateur.verifierBlocValide(blocAVerifier)).to.be.equal(false);

      blocAVerifier = [8, 8, 3, 4, 7, 6, 9, 2, 1];
      expect(verificateur.verifierBlocValide(blocAVerifier)).to.be.equal(false);

      blocAVerifier = [9, 6, 5, 4, 3, 2, 1];
      expect(verificateur.verifierBlocValide(blocAVerifier)).to.be.equal(false);
  });
});

