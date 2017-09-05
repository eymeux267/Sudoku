import { Injectable } from '@angular/core';

import { Score } from './score';
import { LISTESCORESNORMAL } from './mock-scores';
import { LISTESCORESDIFFICILE } from './mock-scores';

@Injectable()
export class ScoreService {

  getScoresNormal(): Score[] {
    return LISTESCORESNORMAL;
  }

    getScoresDifficile(): Score[] {
    return LISTESCORESDIFFICILE;
  }
}

