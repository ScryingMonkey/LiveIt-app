import { Component, OnInit, Input } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import {Observable} from 'rxjs/observable';
import { Subject }    from 'rxjs/Subject';
import { Router, ActivatedRoute }   from '@angular/router';

import { AuthService, TestService, HubService } from '../../services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {  
  model:any = {
    // username:string = 'username',
    // password:string = 'password'
  };
  loading = false;
  returnUrl: string;
  private listTitle: string;
  private liTitleKey: string;
  private auth: Subject<any>;
  private userName: string;
  public isLoggedIn: boolean;
  
  constructor(
    public _as: AuthService, 
    public af: AngularFire, 
    public router: Router, 
    private _test:TestService,
    private route: ActivatedRoute ) {
    console.log('[ LoginComponent.constructor');
    _as.isLoggedIn$.subscribe(isLoggeIn => this.isLoggedIn = isLoggeIn);
  }

  ngOnInit() { 
    console.log('[ LoginComponent.constructor');
    if(this.isLoggedIn) {
      console.log('...already logged in.  Redirecting...');
      this.router.navigate( ['/loggedin'] );
    }
    else if (this.userName == undefined || this.userName.length > 1) {
      this.model = {};
      this.isLoggedIn = false;
      // this._as.logout(); // reset login status
    }
    else {
      console.log('error: neither LoggedIn nor !LoggedIn');
    }
    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  loginWithEmail() { 
    this.loading = true;
    this._as.loginWithEmail(this.model.email, this.model.password); 
  }
  signUpWithEmail(){ 
    this._as.signUpWithEmail(this.model.email, this.model.password); 
  }
  loginWithGoogle() { this._as.loginWithGoogle(); }
  loginWithFacebook() { this._as.loginWithFacebook(); }
  logout() { this._as.logout(); }
  loginTester() { this._as.loginTester(); }

}