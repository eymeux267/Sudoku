import { Score } from './score';
import { Time } from '../timer/time';
const minute: number = 60 * 100;
const heure: number = minute * 60;

const temps1: Time = new Time(20 * minute);
const temps2: Time = new Time(40 * minute);
const temps3: Time = new Time(2 * heure);

temps1.update(20 * minute);
temps2.update(40 * minute);
temps3.update(2 * heure);

export const LISTESCORESNORMAL: Score[] = [
  {nomJoueur: 'JohnDoe111', temps: temps1},
  {nomJoueur: 'JohnDoe222', temps: temps2},
  {nomJoueur: 'JohnDoe333', temps: temps3},

];

export const LISTESCORESDIFFICILE: Score[] = [
  {nomJoueur: 'JohnDoe11', temps: temps1},
  {nomJoueur: 'JohnDoe22', temps: temps2},
  {nomJoueur: 'JohnDoe33', temps: temps3},

];


// Ces mock values sont temporaires et seront remplacees par une base de donnees plus tard dans le projet.
// La base de donnees fera le tri des Score selon leur temps. Le maximum de scores stockes et affiches sera de 6
