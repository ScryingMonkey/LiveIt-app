import { Component, OnInit } from '@angular/core';
import { HubService } from '../../../services/index';
import { User, UserProfile } from '../../../models/index';


@Component({
  selector: 'app-member-landing',
  templateUrl: './member-landing.component.html',
  styleUrls: ['./member-landing.component.css']
})
export class MemberLandingComponent implements OnInit {
  private user:User;
  private userData: Array<any>;
  private userProfileKeys: Array<string>;
  private nextSteps: Array<string>;

  constructor( private _hub:HubService ) { 
    this.user = this._hub._user.getUser();
    this._hub._test.printo('user in member-landing', this.user);
    // this.updateUserProfileKeys(this.user.profile);    
    this._hub._user.getUserao$().subscribe( (res:User) => {
      this.user = res;
      this._hub._test.printo('updated user in member-landing', this.user);    
      // this.processUser(res);
      // this.updateUserProfileKeys(res.profile);
    });
    this.nextSteps = this.getNextSteps();
  }

  ngOnInit() {
  }

  processUser(user:User){
    let o = {};
    for (var key in user.profile) {
      if (user.profile.hasOwnProperty(key)) {
        // let el = user.profile[key];
        o = {key : user.profile[key]};
        this.userData.push(o);    
      }
    }
  }
  updateUserProfileKeys(profile:UserProfile){
    let l = [];
    Object.keys(profile).forEach( el => l.push(el.replace('u ','')));
    String.fromCharCode()
    console.log('>> updated userProfileKeys :'+l);
    console.dir(l);
    this.userProfileKeys = l;
  }
  getNextSteps() {
    let steps = [
      'Next step',
      'Next step',
      'Next step',
      'Next step',
    ];
    return steps;
  }
}
