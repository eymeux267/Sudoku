import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MeilleursScoresComponent } from './scores/meilleurs-scores.component';
import { ScoreService } from './scores/scores.service';
import { TimerComponent } from './timer/timer.component';
import { UsagerComponent } from './usager/usager.component';
import { GrilleComponent } from './grille/grille.component';
import { GrilleService } from './grille/grille.service';


@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    HttpModule,

    ],
  declarations: [
    AppComponent,
    MeilleursScoresComponent,
    TimerComponent,
    UsagerComponent,
    GrilleComponent,
    ],
  bootstrap:    [ AppComponent ],
  providers: [ ScoreService, GrilleService ]
})
export class AppModule { }
