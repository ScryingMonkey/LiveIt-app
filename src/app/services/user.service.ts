import { Injectable } from '@angular/core';
import { Router }   from '@angular/router';
import { AngularFire,FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2';
import { BehaviorSubject } from "rxjs/Rx";
import { Subject } from 'rxjs/Subject';

import { User, UserAuth, UserProfile } from '../models/index';
import { AuthService, TestService } from './index';


@Injectable()
export class UserService {
  private userref:string = '/users';  
  private user: BehaviorSubject<User> = new BehaviorSubject(new User());
  private userKey: BehaviorSubject<string> = new BehaviorSubject('');
  private userListfbo: FirebaseListObservable<any[]>;
  private userList: BehaviorSubject<Array<any>> = new BehaviorSubject(new Array());
  private userfbo: FirebaseObjectObservable<any>;
  private queryUserByKeyfbo: FirebaseListObservable<any>;

// Constructor and all subscriptions ===============================================
  constructor( 
    private _af: AngularFire,
    private router: Router,
    private _test:TestService,
    private _auth: AuthService
    ){
    console.log('[ UserService.constructor()');

    console.log('>> this.fbuserref: '+this.userref);       
    
    _auth.getAuth().subscribe( (auth) => {
      this._test.printo('...auth updated',auth);
      if (auth.email) { 
        console.log('...res !null.  res.email'+auth.email);
        this.setUserAuth(auth);  // updates user when _auth.auth updates
        this.userKey.next(new User().convertKey(auth.email));
        console.log('>> updated userKey: '+new User().convertKey(auth.email));
        // this.createUserinDB(res);
        this.setupFbos();
        this.setupSubs(auth);

        
        this.userListfbo.take(1).toPromise()
        .then( res => {
          let k = this.userKey.getValue();
          if (this.isUserInList(k, res)) {
            console.log('...found '+k+' in list');

            this.userfbo.take(1).toPromise()
            .then(res => {
              console.log('...routing to landing page.')
              this._test.printo('returned res from db', res);
              this.routeToLandingPage(res);
            })
            .catch(err => console.log('...cannot route to landing page: '+err));

          } else {
            console.log('...did not find '+k+' in list');

            this.createUserInDB(auth);
          }
        }).catch( err => console.log('Error: '+err));

      } else {
        console.log('...res null.  res.email'+auth.email);
        this.router.navigate( ['/login'] );  // if no _auth.auth object, route to login page
    } });
    

  }
// Setups ========================================================================================
  setupFbos(){
    this.userListfbo = this._af.database.list(this.userref);
    console.log('...binding userfbo to key:'+this.userKey.getValue());
    this.userfbo = this._af.database.object(this.userref+'/'+this.userKey.getValue())
    // this.queryUserByKeyfbo = this._af.database.list(this.userref, {query: {  } });
  }
  setupSubs(auth) {
    this.userListfbo.subscribe(res => {
      this._test.printo('>> userListfbo bound', res);
      this.userList.next(res);
    });

    this.userfbo.subscribe(res => {
      this._test.printo('>> userfbo bound: ', res);
    });

    this.user.subscribe( res => console.log('>> user updated') );
  }

// Helper Methods ===========================================================

  upateUserInDB(user:User){
    console.log('[ UserService.upateUserInDB()');   
    user.key = user.convertKey(user.auth.email);
    this._af.database.object('/users/'+user.key).set( {key:user.key} ); 
    this._af.database.object('/users/'+user.key+'/auth').set( user.auth );         
    this._af.database.object('/users/'+user.key+'/profile').set( user.profile )
      .then( v => {
        this.userKey.next(user.key);
        this.user.next(user);
        console.log('success for '+user);
        this.routeToLandingPage(user);
      })
      .catch(err => console.log(err,'Error: '+err.message));
  }
  createUserInDB(auth:UserAuth) {
    // Need to be logged in before creating user
    console.log('[ UserService.createUserinDB()');   
    let nuser = new User().newUser(auth);
    this.upateUserInDB(nuser);
  }
  isUserInList(key, userList){ // check list of users for key.  If not found return false.
    console.log('[ UserService.isUSerinList('+key+', userList)');
    this._test.printo('...userList in isUserInList',userList);
    for (let n = 0; n < userList.length; n++) {
      // console.log('...comparing '+key+' to '+userList[n].key)
      if (userList[n].key == key) { return true; }
    }
    return false;
  }
  routeToLandingPage(user:User){
    // let user = this.user.getValue();
    console.log('[ UserService.routeToLandingPage()...'+user.profile.userType); 
    this._test.printo('...user',user);      
    let routePath:string = '';
    if (user.profile.userType == 'dummy') {
      routePath = 'survey';
      // this._auth.logout();
    } else if (user.profile.needInfo || user.profile.userType == 'new') { 
      routePath = 'survey'; 
    } else { 
      routePath = ''+user.profile.userType;//+'/'v+this.user.getValue().uid;
    }
    this.router.navigate( [routePath] );
  }
// Logins, Logouts and Sign ups =============================================

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
      this.userListfbo.$ref.off();
      this.userfbo.$ref.off();
      this._af.auth.logout(); // This updates _auth.auth, which triggers a user update
      this.router.navigate(['login']);
  }
  resetPassword() { 
    console.log('[ UserService.resetPassword()');            
    this._auth.resetPassword();
  }

// Getters and Setters ====================================================
  getUserao$() { return this.user.asObservable(); }
  getUser() { return this.user.getValue(); }
  setUser(user:User) { this.user.next(user); }
  getUserAuth():UserAuth { return this.user.getValue().auth; }
  setUserAuth(auth:UserAuth) { 
    let user = this.user.getValue();
    user.auth = auth;
    this.user.next(user);
    this.upateUserInDB(user);
  }
  getUserProfile():UserProfile { return this.user.getValue().profile; }
  setUserProfile(profile:UserProfile) { 
    let user = this.user.getValue();
    this._test.printo('...user in setUserProfile',user);
    user.profile = profile;
    this.user.next(user);
    this.upateUserInDB(user);
  }
  getUserListo() { return this.userListfbo; }

}