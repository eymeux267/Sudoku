import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Time } from './time';

@Injectable()
export class TimerService{
  private timerStartedSource = new Subject<boolean>();
  private timerStoppedSource = new Subject<Time>();

  timerStarted$ = this.timerStartedSource.asObservable();
  timerStopped$ = this.timerStoppedSource.asObservable();

  startTimer(started: boolean){
      this.timerStartedSource.next(started);
  }

  stopTimer(time: Time){
      this.timerStoppedSource.next(time);
  }
}
