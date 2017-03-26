import { Component, OnInit, Input } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import {Observable} from 'rxjs/observable';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject } from "rxjs/Rx";
import { Router, ActivatedRoute }   from '@angular/router';

import { AuthService, TestService, HubService } from '../../services/index';
import { User } from '../../models/index';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {  
  model:any = {  };
  public isLoggedIn: boolean;
  public user: User;
  private loading: boolean = false;
  private signingup: boolean = false;
  
  private returnUrl: string;
  private listTitle: string;
  private liTitleKey: string;
 
  constructor(
    public _as: AuthService, 
    public af: AngularFire, 
    public router: Router, 
    private _test:TestService,
    private _hub:HubService,
    private route: ActivatedRoute ) {
    console.log('[ LoginComponent.constructor');
    this._as.getIsLoggedIn$().subscribe(res => this.isLoggedIn = res);
    this._as.getUser$().subscribe(res => this.user = res);
  }

  ngOnInit() { 
    console.log('[ LoginComponent.ngOnInit');
    if(this.isLoggedIn) {
      console.log('...already logged in.  Redirecting...');
      this.router.navigate( ['/loggedin'] );
    }
    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  switchSigningup() { 
    console.log('...switchSigningup()');
    this.signingup = !this.signingup;
    console.log('signingup: '+this.signingup);
  }
  signUpWithEmail(){ 
    this.loading = true; 
    this._as.signUpWithEmail(this.model.displayName, this.model.email, this.model.password); 
  }
  loginWithEmail() { 
    this.loading = true;
    this._as.loginWithEmail(this.model.email, this.model.password); 
  }
  loginWithGoogle() { this.loading = true; this._as.loginWithGoogle(); }
  loginWithFacebook() { this.loading = true; this._as.loginWithFacebook(); }
  logout() { this.loading = false; this._as.logout(); }
  loginTester() { this._as.loginTester(); }
  userJson() { return JSON.stringify(this.user); }
}