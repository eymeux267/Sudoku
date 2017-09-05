/*
import { Injectable} from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class serviceSudoku {

  private socket = io('http://localhost:3002');

  private getSudoku(user : Usager) : void{
    this.socket.emit('test-user', user.name);
    // let observable = new Observable(observer : Observable<boolean> => {
    //});
  }
  ajouterUsager(user: Usager) : boolean{
    this.testUsager(user);
    this.socket.on('valid-user', () => {

      this.socket.emit('add-user', user.name);
      return true;
    });
    this.socket.on('invalid-user', () => {
      return false;
    });
    return false;
  }
}*/
