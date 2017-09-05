import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'entrez-nom',
  templateUrl: `app/usager/usager.component.html`

})

export class UsagerComponent {
  @Output() onConfirm = new EventEmitter<string>();
  name: string ;
  confirmed : boolean;
  temps : number;

constructor(){
  this.name = '';
  this.confirmed = false;
}

  confirmer() {
     this.onConfirm.emit(this.name);
     this.confirmed = true;
  }
}

