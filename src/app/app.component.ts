import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, AngularFireAuth} from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  items: FirebaseListObservable<any[]>;
  constructor(af:AngularFire, auth:AngularFireAuth){
    this.items = af.database.list('/');
  
  }
}
