import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
import { Observable} from 'rxjs/observable';
import { BehaviorSubject } from "rxjs/Rx";
import { HubService } from '../services/index';

@Injectable() 
export class AuthService {
  private auth: BehaviorSubject<any> = new BehaviorSubject('');
// Constructor and all subscribtion ===========================================
  constructor (
    private _af: AngularFire, 
    public _hub: HubService
    ){
    console.log('[ AuthService.constructor()');
    // subscribe to auth object
    this._af.auth.subscribe((res: FirebaseAuthState) => {
      console.log("[ AuthService.constructor._af.auth.subscription");
      this.auth.next(res.auth);
      this._hub._test.printo('...updating _auth.auth:',res.auth);
    });
  }

// Login/Logout methods =======================================================
  loginWithEmail(email, password) {
      console.log("[ AuthService: Signing in with email: "+email);
      this._af.auth.login(
            { email: email, password: password, },
            { provider: AuthProviders.Password, method: AuthMethods.Password, } )
          .then(res => console.log('...success for '+email+', '+res))
          .catch(err => {
            console.log(err,'...error for '+email+', '+err);
            this._hub._toast.toast(true, 'error', 'Error', 'Wrong password.');
            this._hub.setLoading(false);
          });
      // Firebase updates _af.auth, which updates _auth.auth, which triggers _user subscription.
  }
  loginWithFacebook() {
      console.log("[ AuthService: Signing in with Facebook");    
      this._af.auth.login(
            { provider: AuthProviders.Facebook, method: AuthMethods.Popup, })
          .then(res => console.log('...success for Facebook login.  '+res))
          .catch(err => {
            console.log(err,'...error for Facebook login.  '+err);
            this._hub._toast.toast(true, 'error', 'Error', 'Wrong password.');
            this._hub.setLoading(false);
            });
      // Firebase updates _af.auth, which updates _auth.auth, which triggers _user subscription.    
  }
  loginWithGoogle() {
      console.log("[ AuthService: Signing in with Google");        
      this._af.auth.login(
            { provider: AuthProviders.Google, method: AuthMethods.Popup, })
          .then(res => console.log('...success for Facebook login.  '+res))
          .catch(err => {
            console.log(err,'...error for Facebook login.  '+err);
            this._hub._toast.toast(true, 'error', 'Error', 'Wrong password.');
            this._hub.setLoading(false);
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
      .then(res => console.log('...success signing up new email user.  '+res))
      .catch(err => {
        console.log(err,'...error signing up new email user.  '+err);
        this._hub._toast.toast(true, 'error', 'Error: '+err.name, err.message);
        this._hub.setLoading(false);
      });
    // Firebase updates _af.auth, which updates _auth.auth, which triggers _user subscription.  
  }
  
  // User update methods ==========================================================
  resetPassword() {
    console.log("[ AuthService.resetPassword()");
    this._af.auth.getAuth().auth.sendEmailVerification()
    .then(res=> (this._hub._test.printo('...reset succeeded',res)))
    .catch(err=> (this._hub._test.printo('...reset faile',err.message)));
  }
  
  // Getters ======================================================================
  getAuth() { return this.auth; }

} 
