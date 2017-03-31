import { Component, OnInit } from '@angular/core';

import { User, UserAuth, UserProfile } from '../../models/index';
import { UserService, HubService } from '../../services/index';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  private user:User = new User();
  private empties:Array<string> = [];

  constructor(private _user:UserService) {
    this._user.getUser$().subscribe((res:User) => {
      this.user = res;
      this.empties = this.checkUserForEmpties(this.user);
    });
  }
  checkUserForEmpties(user:User) {
    let empties = [];
    user.profile.displayName;       
    for (var key in user.profile) {
      if (user.profile.hasOwnProperty(key)) {
        var element = user.profile[key];
        if (element.length < 1) { empties.push(key); }
      }
    }
    return empties;
  }

  ngOnInit() {
  }

}
