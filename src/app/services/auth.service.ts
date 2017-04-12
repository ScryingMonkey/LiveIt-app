import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
import { Observable} from 'rxjs/observable';
import { BehaviorSubject } from "rxjs/Rx";
import { HubService } from '../services/index';

import { UserAuth } from '../models/index';

@Injectable() 
export class AuthService {
  private auth: BehaviorSubject<any> = new BehaviorSubject('');
  private error: BehaviorSubject<Error> = new BehaviorSubject(null);

// Constructor and all subscribtion ===========================================
  constructor (
    private _af: AngularFire
    ){
    console.log('[ AuthService.constructor()');
    
    this.auth.subscribe( res => console.log('>> _auth.auth updated'));  // subscribe to auth object
    
    this._af.auth.subscribe( (res: FirebaseAuthState) => {  // subscribe to _af.auth object
      console.log("[ AuthService.constructor._af.auth.subscription");
      if (res) { 
        console.log('...updating _auth.auth.email'+res.auth.email);
        let auth = new UserAuth();
        auth.setValues( res.auth.displayName, res.auth.email,
          res.auth.photoURL, res.auth.providerData[0].providerId, res.auth.uid);
        this.auth.next(auth);
      } else { 
        console.log('..._af.auth is null.');        
        this.logout(); 
      }

    });
  }

// Login/Logout methods =======================================================
  loginWithEmail(email, password) {
      console.log("[ AuthService: Signing in with email: "+email);
      this._af.auth.login(
            { email: email, password: password, },
            { provider: AuthProviders.Password, method: AuthMethods.Password, } )
          .then(res => {
            console.log('...success for '+email+'; authstate: '+res);
            this.error.next(null);
          } )
          .catch(err => {
            console.log(err,'...error for '+email+', '+err);
            this.error.next(err);
          });
      // Firebase updates _af.auth, which updates _auth.auth, which triggers _user subscription.
  }
  loginWithFacebook() {
      console.log("[ AuthService: Signing in with Facebook");    
      this._af.auth.login(
            { provider: AuthProviders.Facebook, method: AuthMethods.Popup, })
          .then(res => {
            console.log('...success for Facebook login.  '+res);
            this.error.next(null);
      } )
          .catch(err => { 
            console.log(err,'...error for Facebook login.  '+err);
            this.error.next(err);
            });
      // Firebase updates _af.auth, which updates _auth.auth, which triggers _user subscription.    
  }
  loginWithGoogle() {
      console.log("[ AuthService: Signing in with Google");        
      this._af.auth.login(
            { provider: AuthProviders.Google, method: AuthMethods.Popup, })
          .then(res => {
            console.log('...success for Facebook login.  '+res);
            this.error.next(null);
      } )
          .catch(err => {
            console.log(err,'...error for Facebook login.  '+err);
            this.error.next(err);
            });
      // Firebase updates _af.auth, which updates _auth.auth, which triggers _user subscription.
  }
  logout() {
      console.log("[ AuthService.logout()");
      this._af.auth.logout();
      // Firebase updates _af.auth, which updates _auth.auth, which triggers _user subscription.      
  }

// User creation ==============================================================
  signUpWithEmail(email:string, password:string){ 
    console.log('>> AuthService: Signing up new email user:'+email);
    console.log('...sign up params: '+email+', '+password);     
 
    // Create User in Firebase User db
    this._af.auth.createUser({ email: email, password: password })
      .then(res => {
        console.log('...success signing up new email user.  authstate: '+res);
        console.dir(res);
        this.error.next(null);
        this.loginWithEmail(email, password);
      } )
      .catch(err => { 
        console.log(err,'...error creating user from email.  '+err);
        this.error.next(err); 
      } );
    // Firebase updates _af.auth, which updates _auth.auth, which triggers _user subscription.  
  }
  
  // User update methods ==========================================================
  resetPassword() {
    console.log("[ AuthService.resetPassword()");
    this._af.auth.getAuth().auth.sendEmailVerification()
    .then(res=> console.log('...reset succeeded',res))
    .catch(err=> console.log('...reset failed',err.message));
  }
  
  // Getters ======================================================================
  getAuth() { return this.auth; }
  getErrorao$() { return this.error.asObservable(); }

} 
