import { Injectable } from '@angular/core';
import { Router }   from '@angular/router';
import { AngularFire,FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2';
import { BehaviorSubject } from "rxjs/Rx";
import { Subject } from 'rxjs/Subject';

import { User, UserAuth, UserProfile } from '../models/index';
import { AuthService, HubService } from './index';


@Injectable()
export class UserService {
  private user: BehaviorSubject<User> = new BehaviorSubject(new User());
  private fbuserref: FirebaseListObservable<any[]>;
  private queryByKey: FirebaseListObservable<any[]>;
  private userKey: Subject<string> = new Subject();

  constructor( 
    private _af: AngularFire,
    private router: Router,
    private _hub: HubService,
    private _auth: AuthService
    ){
    console.log('[ UserService.constructor()');
    this.fbuserref = _af.database.list('/users');
    _af.database.list('/user', 
      { query: { orderByChild: 'key', equalTo: this.userKey }})
      .subscribe(res => this.user.next(this.convertToUser(res)));
    // set up events for when global user updates
    this.user.subscribe((res:User)=>{
      // TODO: What should happen when global user object updates?
    });
    // triggers when auth state changes
    this._auth.getIsLoggedIn$().subscribe((loggedIn:boolean)=>{
      if (loggedIn){
        console.log("[ UserService.constructor.getIsLoggedIn$.subscription");
        let nuser = new User();
        this._hub._test.printo('...creating nuser', nuser);
        let auth = this._auth.getAuthstate(); // get static _as.auth.auth from _auth

        nuser = this.updateUser(nuser, auth.auth); // update user object from from auth.auth    
        
        this.user.next(nuser); // Update _user global user observable from user object
        
        console.log( '...logged in and updated!' ); // print global user observable to make sure everything is updated
        this._hub._test.printo('auth.auth',auth.auth);
        this._hub._test.printo('this.user',this.user);

        // create route path from user userType
        let routePath = ''+this.user.getValue().profile.userType//+'/'v+this.user.getValue().uid;  
        // Route view to appropriate landing page
        console.log('...redirecting to '+routePath);
        this.router.navigate( [routePath] );
      } else {
        this.user.next( new User() );
        // this.user.complete(); }
        this._hub._test.printo('...logged out. this.user', this.user);
        this.router.navigate( ['/login'] );
      }
    });
  }

  createUserinDB(user:User) {
    // TODO need to be logged in before creating user
    console.log('[ UserService.createUser()');   
    let key = user.auth.email;
    let sendobject = user
    sendobject['key'] = key; 
    console.log('sendobject:');
    console.dir(sendobject);
    this.fbuserref.push(sendobject)
      .then(res => console.log('success for '+user+''+res))
      .catch(err => console.log(err,'error: '+err));
  }
  retrieveUser(key:string){
  // update global user object from db by key
    this.userKey.next(key);
    return this.user.getValue();
  }
  convertToUser(res){
  // convert firebase response to User object
    let user = new User();
    user.auth = res.auth;
    user.profile = res.profile;
    return user;
  }

// User update pipeline =============================================================
  updateUser(user,auth){
    // Summary method for user update pipeline.
      console.log('[ UserService.updateUserFromAuth('+user+','+auth+')');

      // Update nuser.auth from _as.auth object
      user = this.updateUserAuthFromAuthObj(user,auth);

      // TODO: Update nuser.profile from firebase database
      user = this.updateUserProfileFromDatabase(user);

      // print out nuser to verify update
      this._hub._test.printo("......returning updated user from auth.auth: ", user );

      // Update global user object
      this.user.next(user);

      return user;
  }
  updateUserAuthFromAuthObj(user:User,authObj){
  // Update user object from auth.auth object from firebase
  // Returns updated user object
    console.log('[ UserService.updateUserAuthFromAuthObj('+user+','+authObj+')');
    let auth = new UserAuth();
    auth.email = authObj.providerData[0][auth.emailKey]
    auth.photoURL = authObj.providerData[0][auth.photoURLKey]    
    auth.providerId = authObj.providerData[0][auth.providerIdKey]    
    auth.uid = authObj.providerData[0][auth.uidKey]   

    user.auth = auth;
    this._hub._test.printo('..updated nuser.auth',user.auth);

    return user;
  }
  updateUserProfileFromDatabase(user:User) {
  // Update user object from a database lookup of user.
  // If no user found, create user in db
  // Returns updated user object
    console.log('[ UserService.updateUserProfileFromDatabase('+user+')');
    let dbuser = this.retrieveUser(user.auth.email); // update global user object from db
    if (dbuser) {
      user.profile = dbuser.profile;
      this._hub._test.printo('...updated nuser.profile from db', user.profile); 
    } else {
      this._hub._test.printo('...user not found in db', dbuser);
      // Update user in users db
      this.createUserinDB(user);
      this._hub._test.printo('...user created in db', user);      
    }
    return user;
  }

  // Logins, Logouts and Sign ups ===========================================
  signUpWithEmail(displayName:string, email:string, password:string){ 
    console.log('[ UserService.signUpWithEmail('+displayName+', '+email+', '+password+')');    
    let nuser = this._auth.signUpWithEmail(displayName, email, password);
    this.user.next(nuser); // update global user object, which triggers user update
  }
  loginWithEmail(email, password) {
    let nuser = this._auth.loginWithEmail(email, password);
    this.user.next(nuser); // update global user object, which triggers user update
  }
  loginWithGoogle() { 
    let nuser = this._auth.loginWithGoogle();
    this.user.next(nuser); // update global user object, which triggers user update
  }
  loginWithFacebook() { 
    let nuser = this._auth.loginWithFacebook();
    this.user.next(nuser); // update global user object, which triggers user update
  }
  logout() {
      console.log("[ UserService.logout()");
      this._af.auth.logout(); // This updates getIsLoggedIn$, which triggers a user update
  }
  resetPassword() { return this._auth.resetPassword(); }

  // Getters and Setters ====================================================
  getUser$() { return this.user.asObservable(); }
  setUser(user:User) { this.user.next(user); }
  getIsLoggedIn$() { return this._auth.getIsLoggedIn$(); }
  loginTester() { return this._auth.loginTester(); }
}

// TODO:  Need to keep a consistant user object throughout.  
//        Should only create a new user in login/signup methods.