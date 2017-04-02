import { Component, OnInit, Input } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import {Observable} from 'rxjs/observable';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject } from "rxjs/Rx";
import { Router, ActivatedRoute }   from '@angular/router';

import { UserService, HubService } from '../../services/index';
import { User } from '../../models/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  
})

export class LoginComponent implements OnInit {  
  model:any = {  };
  public user: User;
  private signingup: boolean = false;
  private isLoggedIn: boolean = false;
  
  private returnUrl: string;
  private listTitle: string;
  private liTitleKey: string;
 
  constructor(
    private _hub: HubService,
    public af: AngularFire, 
    public router: Router, 
    private _user: UserService,
    private route: ActivatedRoute ) {
    console.log('[ LoginComponent.constructor');
    this._user.getUserao$().subscribe(res => {
      this.user = res;
      if (res.profile.userType == 'dummy') { this.isLoggedIn = false; 
      } else { this.isLoggedIn == true; 
      } });
  }

  ngOnInit() { 
    console.log('[ LoginComponent.ngOnInit');
    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  switchSigningup() { 
    console.log('...switchSigningup()');
    this.signingup = !this.signingup;
    console.log('signingup: '+this.signingup);
  }
  signUpWithEmail(){ 
    this._hub.setLoading(true); 
    this._user.signUpWithEmail(this.model.displayName, this.model.email, this.model.password); 
  }
  loginWithEmail() {
    this._hub.setLoading(true); 
    this._user.loginWithEmail(this.model.email, this.model.password); 
  }
  loginWithGoogle() { this._hub.setLoading(true); this._user.loginWithGoogle(); }
  loginWithFacebook() { this._hub.setLoading(true);this._user.loginWithFacebook(); }
  logout() { this._hub.setLoading(false); this._user.logout(); }
  userJson() { return JSON.stringify(this.user); }
}