import { Component, OnInit } from '@angular/core';
import { BarrelOfMonkeysComponent, Monkey } from '../barrelofmonkeys/index';
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
  private bom:Array<Monkey>;
  private showBom:boolean;

  constructor(private _user:UserService, private _hub:HubService) {
    console.log('[ SurveyComponent.constructor...');
    this._user.getUserao$().subscribe((res:User) => {
      this.user = res;
      this.empties = this.checkUserForEmpties(this.user);
    });
    this._hub.getShowBom().subscribe(res => this.showBom = res);
    this._hub.setShowBom(true); // show bom.
    this.bom = [ //initialize bom and pass it to BarrelOfMonkeysComponent via template
                { key:'displayName', 
                  image:'elephant', 
                  blurb:'Hi!  What is your name?', 
                  optionType:'textinput', 
                  options:['put a textbox here instead'], 
                  followers:['userType'], 
                  submit:'Next', 
                  hat:'Skullcap' },
                { key:'userType', 
                  image:'flamingo', 
                  blurb:'Are you a coach or a member?', 
                  optionType:'dropdown', 
                  options:['Coach', 'Member'], 
                  followers:['userLevel'], 
                  submit:'Next', 
                  hat:'Yellow Boiler' },
                { key:'userLevel', 
                  image:'elephant', 
                  blurb:'What is your level?', 
                  optionType:'radio', 
                  options:['1','2','3','4'], 
                  followers:[], 
                  submit:'Submit', 
                  hat:'Blue Trucker Hat' }
                ];
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
