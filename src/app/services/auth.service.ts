import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
import { Subscription} from 'rxjs/subscription';
import { Observable} from 'rxjs/observable';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject } from "rxjs/Rx";

import { User } from '../models/index';
import { HubService } from '../services/index';

@Injectable() 
export class AuthService {
  private authstate: FirebaseAuthState; 
  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor (
    private _af: AngularFire, 
    public _hub: HubService
    ){
    console.log('[ AuthService.constructor()');
    // subscribe to auth object
    this._af.auth.subscribe((auth: FirebaseAuthState) => {
      console.log("[ AuthService.constructor._af.auth.subscription");
      this.authstate = auth;
      this._hub._test.printo('authstate:',this.authstate);
      if(auth) {
        console.log('...auth == true, updating isLoggedIn.');
        this.isLoggedIn.next(true);  // updating isLoggedIn triggers UserService to update user
      } else { // if no auth object exists
        console.log( '...no auth...not logged in' );
        this.isLoggedIn.next(false);  // updating isLoggedIn triggers UserService to update user        
        console.log("...isLoggedIn == " + this.isLoggedIn.value);           
      }
    } );
  }

// Login/Logout methods =======================================================
  loginWithEmail(email, password) {
      console.log("Signing in with email:"+email);
      this._af.auth.login(
            { email: email, password: password, },
            { provider: AuthProviders.Password, method: AuthMethods.Password, } )
          .then(res => console.log('success for '+email+', '+res))
          .catch(err => {
            console.log(err,'error for '+email+', '+err);
            this._hub._toast.toast(true, 'error', 'Error', 'Wrong password.');
            this._hub.setLoading(false);
          });
      // Create new user object and update with keys for this provider.
      let nuser = new User();
      // TODO: Pull display name and picture data from user db and set profile values.
      nuser.auth.emailKey = 'email';
      nuser.auth.userHasPicture = false;
      return nuser;
  }
  loginWithFacebook() {
      this._af.auth.login(
            { provider: AuthProviders.Facebook, method: AuthMethods.Popup, })
          .then(res => console.log('success for Facebook login.  '+res))
          .catch(err => {
            console.log(err,'error for Facebook login.  '+err);
            this._hub._toast.toast(true, 'error', 'Error', 'Wrong password.');
            this._hub.setLoading(false);
            });
      // Create new user object and update with keys for this provider.
      let nuser = new User();
      nuser.auth.displayNameKey = 'displayName';
      nuser.auth.emailKey = 'email';
      nuser.auth.userHasPicture = true;
      nuser.auth.photoURLKey = 'photoURL';
      console.log('...updated settings for Facebook login');
      return nuser;      
  }
  loginWithGoogle() {
      this._af.auth.login(
            { provider: AuthProviders.Google, method: AuthMethods.Popup, })
          .then(res => console.log('success for Facebook login.  '+res))
          .catch(err => {
            console.log(err,'error for Facebook login.  '+err);
            this._hub._toast.toast(true, 'error', 'Error', 'Wrong password.');
            this._hub.setLoading(false);
            });
      // Create new user object and update with keys for this provider.
      let nuser = new User();
      nuser.auth.displayNameKey = 'displayName';
      nuser.auth.emailKey = 'email';
      nuser.auth.userHasPicture = true;
      nuser.auth.photoURLKey = 'photoURL';
      console.log('...updated settings for Google login');
      return nuser;
  }
  logout() {
      console.log("[ AuthService.logout()");
      this._af.auth.logout();
      // this.isLoggedIn.next(false);
  }

// User creation ====================================================================
  signUpWithEmail(displayName:string, email:string, password:string){ 
    console.log('>> Signing up new email user:'+email);
    console.log('sign up params: '+displayName+', '+email+', '+password);
    // TODO: Check for user in User db.
      // if user present in db:
      //   pull user data error
      // else:
      //  create user and set user.profile.needInfo to true
    // Create new user object and update with keys for this provider.
    let nuser = new User();          
    nuser.auth.emailKey = 'email';
    nuser.auth.userHasPicture = false;
    nuser.profile.displayName = displayName;
    nuser.profile.needInfo = true;
 
    // Create User in Firebase User db
    this._af.auth.createUser({ email: email, password: password });
    return nuser;
  }
  
  // User update methods ==========================================================
  resetPassword() {
    console.log("[ AuthService.resetPassword()");
    let reset = this.authstate.auth.sendEmailVerification();
    reset.then(res => console.log(res));
    console.dir(reset);
  }
  updateIsLoggedIn(user:User) {
  // Update global isLoggedIn
    console.log('[ AuthService.updateIsLoggedIn()');
    let loggedIn = false;
    if (user.auth.email.length < 1){ loggedIn = false;
    } else { loggedIn = true;
    }
    this.isLoggedIn.next( loggedIn );
  }
// Testing methods ==============================================================
  loginTester() {
    console.log("[ AuthService testing method");
    console.log("......isLoggedIn == " + this.isLoggedIn.value);
    console.log("......logged in auth.auth :"+this.authstate.auth.displayName);
  }
  
  // Getters

  // get isLoggedIn$() { return this.isLoggedIn.asObservable(); }
  getIsLoggedIn$() { return this.isLoggedIn.asObservable(); }
  getAuthstate() { return this.authstate; }
} 