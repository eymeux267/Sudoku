import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Time } from "./time";

@Component({
  selector: 'timer-element',
  templateUrl: `app/timer/timer.component.html`

})
export class TimerComponent{
  @Input() public reinitialiserChronometre: boolean;
  @Input() public terminerPartie: boolean;
  public display: string;
  private started: boolean;
  private timeCounter: number;
  private time: Time = new Time(0);
  public timerCacher: boolean;
  @Output() partieEstFinie: EventEmitter<Time> = new EventEmitter<Time>();

  constructor() {
    this.started = false;
    this.timeCounter = 0;
    this.timerCacher = false;
    this.start();
  }

  start() {
    this.started = true;
    this.timer();
  }

  stop() {
    this.started = false;
  }

  reset() {
    this.started = false;
    this.timeCounter = 0;
    this.time = new Time(0);
    this.display = this.time.toString();
  }

  getTime(): Time{
    return this.time;
  }

  cacherTimer(): void {
    this.timerCacher = true;
  }

  montrerTimer(): void {
    this.timerCacher = false;
  }

  partieEstTerminee(){
    this.stop();
    this.partieEstFinie.emit(this.time);
  }

  timer() {
    if (this.started === true) {
      setTimeout(() => {
        //anti-rebond (lorsqu'on reset pendant que le timer roule)
        if (this.started === true && !this.reinitialiserChronometre){
          this.timeCounter++;
          this.time.update(this.timeCounter);

          this.display = this.time.toString();
          this.timer();
        }
       else {
          this.reset();
          this.start();
       }
       if (this.terminerPartie){
          this.partieEstTerminee();
       }


      }, 10);
    }
  }
}
