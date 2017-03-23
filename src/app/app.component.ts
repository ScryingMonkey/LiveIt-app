import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, AngularFireAuth} from 'angularfire2';
import { AuthService } from './services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LiveIt App';
  items: FirebaseListObservable<any[]>;
  constructor(private _af:AngularFire, private _as:AuthService){
    this.items = _af.database.list('/');
  }
  logout() { this._as.logout(); }
}
