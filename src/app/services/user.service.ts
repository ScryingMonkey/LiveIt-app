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
  private userKey: Subject<string> = new Subject();
  private userList: FirebaseListObservable<any[]>;
  private dbuser: FirebaseObjectObservable<User>;
  private fbuserref:string = '/users';

// Constructor and all subscriptions ===============================================
  constructor( 
    private _af: AngularFire,
    private router: Router,
    private _hub: HubService,
    private _auth: AuthService
    ){
    console.log('[ UserService.constructor()');
    _auth.getAuth().subscribe( (res:UserAuth) => this.setUserAuth(res) ); // updates user when _auth.auth updates
    this.dbuser = _af.database.object(this.fbuserref+this.userKey); // 2 way binding for Firebase db object with key == userKey
    this.userList = _af.database.list(this.fbuserref); // 2 way binging to Firebase db "/users"
    this.userKey.subscribe(res => console.log('>> userKey updated: '+res));  // tester to see if user updates when userKey updates
    this.user.subscribe((res:User)=> {
        //test
    });
    this.dbuser.subscribe( (res:User) => { 
      _hub._test.printo('...dbuser updated', res);      
      if (!res.profile) { 
        console.log('...failed to pull user from db');         
        this.createUserinDB(this._auth.getAuth().getValue()); // creates user if not there was found
      } else { 
        console.log('...successfully pulled user from db');         
        this.user.next(res); // when dbuser changes, update user
      }
    }); 
  }


// Helper Methods ===========================================================
  makeInitialRoutePath(user:User){
    console.log('[ UserService.makeInitialRoutePath()...'+user.profile.needInfo); 
    this._hub._test.printo('...user.profile',user.profile);      
    let routePath:string = '';
    if (user.profile.needInfo || user.profile.userType == 'new') { 
      routePath = 'survey'; 
    } else { 
      routePath = ''+user.profile.userType;//+'/'v+this.user.getValue().uid;
    }
    return routePath;
  }
  createUserinDB(auth:UserAuth) {
    // Need to be logged in before creating user
    console.log('[ UserService.createUser()');   
    let nuser = new User().newUser(auth);
    this.userList.push(nuser.key+'/'+nuser)
      .then(res => {
        this.userKey.next(nuser.key);
        console.log('success for '+nuser+', '+res) 
      })
      .catch(err => console.log(err,'Error: '+err.message));
    this.userKey.next(auth.email);  // updates userKey, which triggers a new query for user in database.
  }
// Logins, Logouts and Sign ups ===========================================
  signUpWithEmail(displayName:string, email:string, password:string){ 
    console.log('[ UserService.signUpWithEmail('+displayName+', '+email+', '+password+')');    
    this._auth.signUpWithEmail(email, password);
  }
  loginWithEmail(email, password) { 
    console.log('[ UserService.loginWithEmail('+email+', '+password+')');        
    this._auth.loginWithEmail(email, password); // This updates _auth.auth, which triggers a user update
  }
  loginWithGoogle() { 
    console.log('[ UserService.loginWithGoogle()');            
    this._auth.loginWithGoogle(); // This updates _auth.auth, which triggers a user update
  }
  loginWithFacebook() { 
    console.log('[ UserService.loginWithGoogle()');                
    this._auth.loginWithFacebook(); // This updates _auth.auth, which triggers a user update
  }
  logout() {
      console.log("[ UserService.logout()");
      this._af.auth.logout(); // This updates _auth.auth, which triggers a user update
  }
  resetPassword() { 
    console.log('[ UserService.resetPassword()');            
    this._auth.resetPassword();
  }

  // Getters and Setters ====================================================
  getUserO$() { return this.user.asObservable(); }
  getUser() { return this.user.getValue(); }
  setUser(user:User) { this.user.next(user); }
  getUserAuth():UserAuth { return this.user.getValue().auth; }
  setUserAuth(auth:UserAuth) { 
    let user = this.getUser();
    user.auth = auth;
    this.user.next(user);
  }
  getUserProfile():UserProfile { return this.user.getValue().profile; }
  setUserProfile(profile:UserProfile) { 
    let user = this.getUser();
    user.profile = profile;
    this.user.next(user);
  }
}