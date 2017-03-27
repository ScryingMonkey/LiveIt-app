import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, AngularFireAuth} from 'angularfire2';
import { AuthService, TestService } from './services/index';

import { NotificationsComponent, NotificationsService } from './components/notifications/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LiveIt App';
  items: FirebaseListObservable<any[]>;
  testuser = {'key':'test1','user':{'key':'mT2','name':'Test User', 'b':false}};
  constructor(
        private _af:AngularFire, 
        private _as:AuthService,
        private _test:TestService,
        private _toast:NotificationsService
        ){
    this.items = _af.database.list('/');
  }
  logout() { this._as.logout(); }
}

// TODO: 
// [] Sign up form
// [] route landing page based on user
// [] build Coach framework: FirstTimeLogin, Dashboard, Training, Anatomy, Nutrition, Diet, Articles, Tips  & Tricks
// [] Coach survey
// [] build Member framework: FirstTimeLogin, Dashboard, Articles, ToDos, Fun
// [] Member survey: Health Risk Assement, Willingness to change


// Member Programs:
//   6 week program
//   12 month program
//   Levels: Basic/General, Athlete, Elite
//   Member Landing Page based on Level 
