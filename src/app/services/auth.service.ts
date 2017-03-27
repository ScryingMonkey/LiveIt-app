import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
import { Subscription} from 'rxjs/subscription';
import { Observable} from 'rxjs/observable';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject } from "rxjs/Rx";
import { Router }   from '@angular/router';

import { User, UserAuth, UserProfile } from '../models/index';
import { UserService, HubService } from '../services/index';

@Injectable() 
export class AuthService {
  private user: BehaviorSubject<User> = new BehaviorSubject(new User());
  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private authstate: FirebaseAuthState; 

  constructor (
    private _af: AngularFire, 
    private router: Router,
    private _us: UserService, 
    public _hub: HubService
    ){
    console.log('[ AuthService.constructor()');
    // subscribe to auth object
    this.user.next(new User());
    this._af.auth.subscribe((auth: FirebaseAuthState) => {
      console.log("[ AuthService.constructor._af.auth.subscription");
      this.authstate = auth;
      console.log('authstate:')
      console.dir(this.authstate);
      if(auth) {
        console.log('...auth == true, updating user data...');

        let newUser = this.user.getValue();
        console.dir(newUser);
        newUser = this.updateUser(newUser,auth.auth); // update user object from from auth.auth    
        this.user.next(newUser) // Update global user observable from user object
        
        // print global user observable to make sure everything is updated
        console.log( '......Logged in!  auth.auth, user...' ); 
        console.dir( auth.auth );
        console.dir(this.user.getValue()); 
        this.updateIsLoggedIn(this.user.getValue());

        // create route path from user userType
        let routePath = ''+this.user.getValue().profile.userType//+'/'v+this.user.getValue().uid;  
        // Route view to appropriate landing page
        console.log('...redirecting to '+routePath);
        this.router.navigate( [routePath] );

      } else { // if no auth object exists
        console.log( '...no auth...not logged in' );
        this.user.next( null );
        this.updateIsLoggedIn( this.user.getValue() );
        this.printUserData( this.user.getValue() );
        console.log('...no user.  Redirecting to /login');
        this.router.navigate( ['/login'] );
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
    // Pull current global user object.
    let user = new User();
    // user.setDummyValues();
    // Update with keys for this provider.
    // TODO: Pull display name and picture data from user db and set profile values.
    
    user.auth.emailKey = 'email';
    user.auth.userHasPicture = false;

    // Update global user object.    
    this.user.next(user);  
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
    // create new user object.
    let user = new User();
    // Update with keys for this provider.
    user.auth.displayNameKey = 'displayName';
    user.auth.emailKey = 'email';
    user.auth.userHasPicture = true;
    user.auth.photoURLKey = 'photoURL';
    // Update global user object.
    console.log('...updated settings for Facebook login');
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
    // create new user object.
    let user = new User();
    // Update with keys for this provider.
    user.auth.displayNameKey = 'displayName';
    user.auth.emailKey = 'email';
    user.auth.userHasPicture = true;
    user.auth.photoURLKey = 'photoURL';
    // Update global user object.
    this.user.next(user);
    console.log('...updated settings for Google login');
  }
  logout() {
    console.log("[ AuthService.logout()");
    this._af.auth.logout();
    this.user.next( null );
    // this.updateUserData( null );
    // this.updateUserKeys(null,[true,'none']);
    this.printUserData(this.user.getValue());
    this.user.complete();
    console.log("...isLoggedIn == " + this.isLoggedIn.value);   
    this.router.navigate( ['/login'] );
  }
// User creation ====================================================================
signUpWithEmail(displayName:string, email:string, password:string){ 
    console.log('>> Signing up new email user:'+email);
    let user = new User();
    console.log('sign up params: '+displayName+', '+email+', '+password);
    // TODO: Check for user in User db.
      // if user present in db:
      //   pull user data error
      // else:
      //  create user and set user.profile.needInfo to true
    user.auth.emailKey = 'email';
    user.auth.userHasPicture = false;
    user.profile.displayName = displayName;
    user.profile.needInfo = true;
    // Update global user object.    
    this.user.next(user);  
    // Create User in Firebase
    this._af.auth.createUser({ email: email, password: password });
    }
createUserinDB(user) {
  // create a new entry in user database for user object
  console.log('[ AuthService.updateUserFromAuth('+user+')');
  this._us.createUser(user);
}
// User update pipeline =============================================================
  updateUser(user,auth){
  // Summary method for user update pipeline.
    console.log('[ AuthService.updateUserFromAuth('+user+','+auth+')');

    // Update user from _as.auth object
    user = this.updateUserFromAuthObj(user,auth);

    // TODO: Update user from firebase database
    user = this.updateUserFromDatabase(user);

    console.log( "......returning updated user from auth.auth: " + user.displayName );
    console.dir( user );
    // Update user in users db
    this.createUserinDB(user);
    return user;
  }
  updateUserFromAuthObj(user:User,authObj){
  // Update user object from auth.auth object from firebase
  // Returns updated user object
    console.log('[ AuthService.updateUserFromAuthObj('+user+','+authObj+')');
    // console.dir(user);
    // console.dir(authObj);
    // create user.auth object
    let auth = user.auth;
    auth.email = authObj.providerData[0][auth.emailKey]
    auth.photoURL = authObj.providerData[0][auth.photoURLKey]    
    auth.providerId = authObj.providerData[0][auth.providerIdKey]    
    auth.uid = authObj.providerData[0][auth.uidKey]   
    // console.log('...updated user.auth:');
    // console.dir(auth); 
    // // update local user object from auth
    user.auth = auth;
    // console.log('...updated user:');
    // console.dir(user);
    return user;
  }
  updateUserFromDatabase(user:User) {
  // Update user object from a database lookup of user
  // Returns updated user object
    console.log('[ AuthService.updateUserFromDatabase('+user+')');
    
    // TODO: Update user type based on entry in user db
    let profile = user.profile;
    let types = ['user','coach'];
    let r = Math.floor(Math.random()*types.length);
    profile.userType = types[r];
    user.profile = profile;
    // console.log('...updated user.profile:');
    // console.dir(profile); 
    return user;
  }
  updateIsLoggedIn(user:User) {
  // Update global isLoggedIn
    console.log('[ AuthService.updateIsLoggedIn()');
    let loggeIn = false;
    if (user == null){ loggeIn = false;
    } else { loggeIn = true;
    }
    this.isLoggedIn.next( loggeIn );
  }
// User update methods ==========================================================
resetPassword() {
  console.log("[ AuthService.resetPassword()");
  let reset = this.authstate.auth.sendEmailVerification();
  reset.then(res => console.log(res));
  console.dir(reset);
}
// Testing methods ==============================================================
  loginTester() {
    console.log("[ AuthService testing method");
    console.log("......isLoggedIn == " + this.isLoggedIn.value);
    console.log("......logged in user :"+this.user.getValue().profile.displayName);
    if(this.user) { console.dir(this.user.getValue());
    } else { console.log('......no user'); }
  }
  
  // Getters
  // get user$() { return this.user.asObservable(); }
  getUser$() { return this.user.asObservable(); }
  // get isLoggedIn$() { return this.isLoggedIn.asObservable(); }
  getIsLoggedIn$() { return this.isLoggedIn.asObservable(); }

  //testers
  printUserData(user) { 
    console.log('...user:'+user);
    console.dir(user);
   }
} 