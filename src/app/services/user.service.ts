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
      .subscribe(res => {
        this._hub._test.printo('...received user from db', res);
        this.processResOfQueryByKey(res);
      });
    // set up events for when global user updates
    this.user.subscribe((res:User)=>{
      // TODO: What should happen when global user object updates?
      console.log('[ UserService.constructor().user.subscribe()')
      this._hub._test.printo('...user updated',res);
    });
    // triggers when auth state changes
    this._auth.getIsLoggedIn$().subscribe((loggedIn:boolean)=>{
      console.log("[ UserService.constructor.getIsLoggedIn$.subscription");      
      if (loggedIn){
        let user = this.user.getValue(); // current value of global user
        let authState = this._auth.getAuthstate(); // get static _as.auth.auth from _auth
        this.updateUser(user,authState.auth) // Update global user from _as.auth object and attempt to retrieve user from db.  If no user is found, create one.         
        console.log( '...logged in and updated!' ); // print global user observable to make sure everything is updated
        let routePath:string = this.makeInitialRoutePath(this.user.getValue()); // create route path
        console.log('...redirecting to: '+routePath);
        this.router.navigate( [routePath] ); // Route view to appropriate landing page
      } else {
        this.user.next( new User() ); // blank out global user
        this._hub._test.printo('...logged out. this.user', this.user);
        this.router.navigate( ['/login'] );
      }
    });
  }

  makeInitialRoutePath(user:User){
    console.log('[ UserService.makeInitialRoutePath()...'+user.profile.needInfo); 
    this._hub._test.printo('...user.profile',user.profile);      
    let routePath:string = '';
    if (user.profile.needInfo) { 
      routePath = 'survey'; 
    } else { 
      routePath = ''+user.profile.userType;//+'/'v+this.user.getValue().uid;
    }
    return routePath;
  }
  createUserinDB(user:User) {
    // Need to be logged in before creating user
    console.log('[ UserService.createUser()');   
    // let key = user.auth.email;
    // let sendobject = user
    // sendobject['key'] = key; 
    // console.log('sendobject:');
    // console.dir(sendobject);
    user.profile.needInfo = true;
    this.fbuserref.push(user)
      .then(res => console.log('success for '+user+''+res))
      .catch(err => console.log(err,'error: '+err));
  }
  convertToUser(res){
  // convert firebase response to User object
    console.log('[ UserService.convertToUser(res)');  
    this._hub._test.printo('...res',res);
    let user = new User();     
    if(res.length > 0){
      user.auth = res.auth;
      user.profile = res.profile;
    } else {
      console.log('...res empty.  returning this.user');
      user = this.user.getValue();
    }
    return user;
  }

// User update pipeline =============================================================
  updateUser(user:User,auth){
    // Summary method for user update pipeline.
      console.log('[ UserService.updateUserFromAuth('+user+','+auth+')');
      this.updateUserAuthFromAuthObj(user,auth);
      if (user.profile.userType == 'new'){
        // Do nothing
      } else {
        this.updateKeyOfQueryByKey(auth[user.auth.emailKey]);
      }
  }
  updateUserAuthFromAuthObj(user:User,authObj){
  // Update user object from auth.auth object from firebase
  // Returns updated user object
    console.log('[ UserService.updateUserAuthFromAuthObj('+user+','+authObj+')');
    let auth:UserAuth = this.user.getValue().auth;
    user.key = authObj[auth.emailKey];
    auth.email = authObj.providerData[0][auth.emailKey]
    auth.photoURL = authObj.providerData[0][auth.photoURLKey]    
    auth.providerId = authObj.providerData[0][auth.providerIdKey]    
    auth.uid = authObj.providerData[0][auth.uidKey]   
    user.auth = auth;
    this._hub._test.printo('..updated user.auth',user.auth);
    this.user.next(user); // update global user
  }
  updateKeyOfQueryByKey(key:string){
  // update global user object from db by key
  // If user is found in db, triggers processResOfQueryByKey()
    console.log('[ UserService.retrieveUser('+key+')');   
    this.userKey.next(key);
  }
  processResOfQueryByKey(res){
  // Updates global user.profile if user is found.  Else creates user in db.
    console.log('[ UserService.processResOfQueryByKey()');           
    let userInDB = res.length > 0;
    if(userInDB){
      console.log('...received res, updating user');
      this.updateUserProfileFromDatabase(res); // update global user object from query response
    }else{
      console.log('...no res from DB.  Routing to login.');
      this.user.next( new User() ); // blank out global user
      this.router.navigate( ['/login'] ); 
    }
  }
  updateUserProfileFromDatabase(res) {
  // Update global user object from a database query response.
  // Returns updated user object
    console.log('[ UserService.updateUserProfileFromDatabase('+res+')');
    let user = this.user.getValue();
    let profile:UserProfile = this.convertToUser(res[0]).profile;
    user.profile = profile;
    this.user.next(user); // update global user
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