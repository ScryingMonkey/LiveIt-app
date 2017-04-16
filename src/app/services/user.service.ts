import { Injectable } from '@angular/core';
import { Router }   from '@angular/router';
import { AngularFire,FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2';
import { BehaviorSubject } from "rxjs/Rx";
import { Subject } from 'rxjs/Subject';

import { User, UserAuth, UserProfile } from '../models/index';
import { AuthService, TestService } from './index';


@Injectable()
export class UserService {
  private user: BehaviorSubject<User> = new BehaviorSubject(new User());
  private userList: BehaviorSubject<Array<any>> = new BehaviorSubject(new Array());

  private userfbo: FirebaseObjectObservable<any>;
  private userListfbo: FirebaseListObservable<any[]>;
  private queryUserByKeyfbo: FirebaseListObservable<any>;
  
  private userref:string = '/users';  
  private userKey: string = null;
  private displayName:string = null;

// Constructor and all subscriptions ===============================================
  constructor( 
    private _af: AngularFire,
    private router: Router,
    private _test:TestService,
    private _auth: AuthService
    ){
    console.log('[ UserService.constructor()');
    console.log('>> this.fbuserref: '+this.userref);  
    this._test.printo('>> user instantiated', this.user.getValue());

    this.user.subscribe( res => { // notify when user changes
      console.log('>> user updated');
      console.dir(res);
     } ); 


    _auth.getAuth().subscribe( (auth:UserAuth) => { // when auth changes
      this._test.printo('...auth updated',auth);
      let user:User;
      let routePath:string;

      if (auth.email) { // if firebase returns an authstate
        console.log('...auth.email !null.  auth.email: '+auth.email);
        // update global vars
        if(!this.userKey){ 
          this.userKey = auth.createKey();
          console.log( '>> updated userKey: '+this.userKey );
        }
        if(!this.displayName) { 
          this.displayName = auth.displayName; 
          console.log( '>> updated displayName: '+this.displayName );
        }
        // setup local vars
        this.userListfbo = this._af.database.list(this.userref);
        this.userfbo = this._af.database.object('/users/'+this.userKey+'/profile');

        // pull user list from FB ./users
        this.userListfbo.take(1).toPromise() // TODO: Replace this with a query
          .then(list => { // after userList is pulled successfully
            this._test.printo('>> userListfbo bound', list);
            // set this.userList to FB ./users
            this.userList.next(list);
            if(this.isUserInList(this.userKey, list)){ // Check for user in userlist
              // user found in list
              console.log('...found '+this.userKey+' in list');     
              // pull user and set this.user to userKey
              this.pullUserFromDB(this.userKey)
                .then((u:User) => {  // if user in userList, return user
                  this._test.printo('returned res from db', u);
                  // route to landing page
                  this.routeToLandingPage(u);
                }).catch((err:Error) => { // else return null
                  console.log('...failed to pull user from db: '+err.message);
                  user = null;
                  this.logout();               
                });
            } else { // user not in list.  Build new user and add to list
              // build User
              user = this.buildNewUser(this.displayName, auth); 
              // send local user to db
              this.upateUserInDB(user); 
              // route to landing page
              this.routeToLandingPage(user);
            }


          }).catch((error:Error) => {
            console.log('>> Error  pulling ./users : '+error.message);
            this.logout();
          });

      } else { // if firebase doesn't return and authstate
        console.log('...res null.  res.email'+auth.email);
        // if no _auth.auth object, route to login page
        this.router.navigate( ['/login'] ).then(v => {
          this.logout();
          console.log('...routing to landing page: /login');
        });

      } 
    });
  }

// DB Update Methods ===========================================================
  updateUserAuthInDB(userKey:string, auth:UserAuth){
    console.log('[ UserService.updateUserAuthInDB()'); 
    let fbo = this._af.database.object('/users/'+userKey+'/auth');
    fbo.set( auth ) 
      .then( v => console.log('>> successfully updated auth for '+auth.email))
      .catch(err => console.log(err,'>> Error: '+err.message));
    fbo.$ref.off();
  }
  updateUserProfileInDB(userKey:string, profile:UserProfile){
    console.log('[ UserService.updateUserProfileInDB()');               
    let fbo = this._af.database.object('/users/'+userKey+'/profile');
    fbo.set( profile )
      .then( v => console.log('>> successfully updated profile for '+profile.displayName))
      .catch(err => console.log(err,'Error: '+err.message));
    fbo.$ref.off();
  }
  upateUserInDB(user:User){
    console.log('[ UserService.upateUserInDB()');   
    let fbo = this._af.database.object('/users/'+user.key);
    fbo.set( user )
      .then( v => console.log('>> successfully updated user for '+user.key))
      .catch(err => console.log(err,'Error: '+err.message));
    fbo.$ref.off();
  }
  pullUserFromDB(key:string):Promise<User> {
    console.log('[ UserService.pullUserFromDB()');                   
    let user:User;
    let fbo = this._af.database.object(this.userref+'/'+this.userKey);
    let userPromise:Promise<User> = fbo.take(1).toPromise();
    return userPromise;
    // fbo.$ref.off();
  }

// Helper Methods ===========================================================
  isUserInList(key, userList){ // check list of users for key.  If not found return false.
    console.log('[ UserService.isUserinList('+key+', userList)');
    // this._test.printo('userList in isUserInList',userList);
    if(userList == null || userList.length < 1) { 
      return false; 
    } else {
      for (let n = 0; n < userList.length; n++) {
        // console.log('...comparing '+key+' to '+userList[n].key)
        if (userList[n].key == key) { 
          console.log('...yes.  Found user: '+key); 
          return true; 
        }
      }
    }
    console.log('...no');     
    return false;
  }
  buildNewUser(displayName, auth):User {
    console.log('[ UserService.buildNewUser('+displayName+', auth)');
    let nuser = new User().newUser();
    let profile = new UserProfile();
    profile.displayName = this.displayName;
    profile.userType = 'new';
    nuser.setValues(auth,profile);
    this._test.printo('built nuser with profile', profile);
    this._test.printo('built nuser with displayName: '+displayName, nuser);
    return nuser;
  }
  buildRoutePath(user:User):string {
    console.log('[ UserService.routeToLandingPage()...'+user.profile.userType); 
    // build route path
    let routePath:string = '';
    if (user.profile.userType == 'dummy') {
      routePath = 'login';
      this.logout();
    } else if (user.profile.needInfo || user.profile.userType == 'new') { 
      routePath = 'survey'; 
    } else { 
      routePath = ''+user.profile.userType.toLowerCase();//+'/'v+this.user.getValue().uid;
    }
    return routePath;
  }
  routeToLandingPage(user:User){
    let routePath = '';
    // set this.user to user
    this.user.next(user); 
    // route to landing
    routePath = this.buildRoutePath(user); 
    // route to route path
    this.router.navigate( [routePath] ).then(v => {
      console.log('...routing to landing page: '+routePath);
    });
  }

// Logins, Logouts and Sign ups =============================================

  signUpWithEmail(displayName:string, email:string, password:string){ 
    console.log('[ UserService.signUpWithEmail('+displayName+', '+email+', '+password+')');   
    this.displayName = displayName;
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
      if(this.userListfbo) { this.userListfbo.$ref.off(); console.log('>> userListfbo subscription off');}
      if(this.userfbo) { this.userfbo.$ref.off(); console.log('>> userfbo subscription off');}
      // set this.user to dummy
      this.user.next(new User()); 
      // logout and route to login page
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
    console.log('>> updated user auth.  '+auth.email);
  }
  getUserProfile():UserProfile { return this.user.getValue().profile; }
  setUserProfile(profile:UserProfile) { 
    let user = this.user.getValue();
    user.profile = profile;
    this.user.next(user);
    console.log('>> updated user profile. '+profile.displayName);    
  }
  getUserListo() { return this.userListfbo; }

// Test methods ===============================================================
  testJUser() {
    let user = JSON.stringify(this.user.getValue());
    user = user.replace(/,/gi, ', ')
          .replace(/},/gi, '},                  ')
          .replace(/] ,/gi, '], ');
    return user;
    }

}