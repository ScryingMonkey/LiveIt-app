import { Component, OnInit } from '@angular/core';

import { User, UserAuth, UserProfile } from '../../models/index';
import { UserService, HubService } from '../../services/index';
import { PrettyjsonPipe } from '../../pipes/index';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  private user:User = new User();
  private empties:Array<string> = [];

  constructor(private _user:UserService) {
    this._user.getUserao$().subscribe((res:User) => {
      this.user = res;
      this.empties = this.checkUserForEmpties(this.user);
    });
  }
  checkUserForEmpties(user:User) {
    let empties = [];
    user.profile.displayName;       
    for (var key in user.profile) {
      if (user.profile.hasOwnProperty(key)) {
        var el = user.profile[key];
        if (el.length < 1 || el == 0 || el == 'new') { empties.push(key); }
      }
    }
    return empties;
  }

  ngOnInit() {
  }

}
