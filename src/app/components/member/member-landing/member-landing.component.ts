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

  constructor( private _hub:HubService ) { 
    this.user = this._hub._user.getUser();
    this.updateUserProfileKeys(this.user.profile);    
    this._hub._user.getUserao$().subscribe( (res:User) => {
      this.user = res;
      // this.processUser(res);
      this.updateUserProfileKeys(res.profile);
    });
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
}
