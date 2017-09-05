export class Time {
    public timeCounter: number;
    public heure: any;
    public min: any;
    public sec: any;
    public mSec: any;

    constructor(timeCounter: number){
        this.update(timeCounter);
    }

/*
    update(h: any, m: any, s: any, ms: any): void{
        this.heure = h;
        this.min = m;
        this.sec = s;
        this.mSec = ms;
    }
    */

    update(timeCounter: number): void{
        this.timeCounter = timeCounter;
        this.heure = Math.floor(timeCounter / 100 / 60 / 60);
        this.min = Math.floor(timeCounter / 100 / 60);
        this.min = this.min % 60;
        this.sec = Math.floor(timeCounter / 100);
        this.sec = this.sec % 60;
        this.mSec = timeCounter % 100;
        this.format();
    }

    format(): void {
        // s'assurer d'avoir un format du temps 0:00:00:00
        if (this.min < 10) {
          this.min = "0" + this.min;
        }

        if (this.sec < 10) {
          this.sec = "0" + this.sec;
        }

        if (this.mSec < 10) {
            this.mSec = "0" + this.mSec;
        }
    }

    toNumber(): number{
        return this.timeCounter;
    }
    toString(): string{
        return (this.heure + ":" + this.min + ":" + this.sec + ":" + this.mSec);
    }
}
