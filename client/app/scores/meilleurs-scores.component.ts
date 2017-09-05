import { Component, Input, OnInit } from '@angular/core';
import { Score } from './score';
import { ScoreService } from './scores.service';

@Component({
  selector: 'meilleurs-scores',
  templateUrl: 'app/scores/meilleurs-scores.component.html',
  styleUrls: ['app/scores/meilleurs-scores.component.css'],
})


export class MeilleursScoresComponent implements OnInit{
  private scoresNormal: Score[];
  private scoresDifficile: Score[];
  @Input()
  private nouveauScore: Score;

  //true si difficile, false si normale. Peut etre changee plus tard dans le projet.
  @Input()
  private difficulteDifficile: boolean;

   constructor(private scoreService: ScoreService) { }

   getScoresNormal(){
     return this.scoresNormal;
   }
   setScoresNormal(scoresNormal: Score[]){
     this.scoresNormal = scoresNormal;
   }
   getScoresDifficile(){
     return this.scoresDifficile;
   }
   setScoresDifficile(scoresDifficile: Score[]){
     this.scoresDifficile = scoresDifficile;
   }
   getNouveauScore(){
     return this.nouveauScore;
   }
   setNouveauScore(nouveauScore: Score){
     this.nouveauScore = nouveauScore;
   }

  getScores(): void {
    this.scoresNormal = this.scoreService.getScoresNormal();
    this.scoresDifficile = this.scoreService.getScoresDifficile();
  }

  // Mettre en parametre le tableau quon veut changer.
  mettreAJourScores(tableauScores: Score[] ): void {
   let position = tableauScores.length;

          while (position >= 1 && this.nouveauScore.temps.toNumber() < tableauScores[position - 1].temps.toNumber())
          {
            position--;
          }

          let nouveauMeilleurScore = (position !== tableauScores.length);
          if (nouveauMeilleurScore){
              tableauScores.splice(position, 0, this.nouveauScore);
              tableauScores.pop();
          }
}
 updateDatabase(){
//Lorsquon mettra une database plus tard, on envoie le nouveau tableau a la database
//pour sauvegarder la nouvelle liste de scores.
 }

    ngOnInit(): void {
    this.getScores();

    if (this.difficulteDifficile){
      this.mettreAJourScores(this.scoresDifficile);
    }
    else{
      this.mettreAJourScores(this.scoresNormal);
    }
    this.updateDatabase();
  }


}
