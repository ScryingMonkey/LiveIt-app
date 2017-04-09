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
        let userKey = new User().convertKey(auth.email);        
        this.userKey.next(userKey);
        this.setUserAuth(auth);  // updates user when _auth.auth updates
        console.log('>> updated userKey: '+new User().convertKey(auth.email));
        // this.userfbo.take(1).toPromise().then((res:User) => {
        //   this._test.printo('>> userfbo retrieved from db', res);
        //   this.user.next(res);
        // }).catch((err:Error) => console.log('>>Error pulling user from db: '+err.message));
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

        this.updateUserAuthInDB(userKey, auth);
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
      this.user.next(res);
    });

    this.user.subscribe( res => console.log('>> user updated') );
  }

// DB Update Methods ===========================================================
  updateUserAuthInDB(userKey:String, auth:UserAuth){
    console.log('[ UserService.updateUserAuthInDB()');       
    this._af.database.object('/users/'+userKey+'/auth').set( auth )
      .then( v => console.log('>> successfully updated auth for '+auth.email))
      .catch(err => console.log(err,'>> Error: '+err.message));
  }
  updateUserProfileInDB(userKey:String, profile:UserProfile){
    console.log('[ UserService.updateUserProfileInDB()');       
    this._af.database.object('/users/'+userKey+'/profile').set( profile )
      .then( v => console.log('>> successfully updated profile for '+profile.displayName))
      .catch(err => console.log(err,'Error: '+err.message));
  }
  upateUserInDB(user:User){
    console.log('[ UserService.upateUserInDB()');   
    let userKey = user.convertKey(user.auth.email);
    user.key = userKey;
    this._af.database.object('/users/'+user.key).set( {key:user.key} ); 
    this.updateUserAuthInDB(userKey, user.auth);
    this.updateUserProfileInDB(userKey, user.profile);
  }
  createUserInDB(auth:UserAuth) {
    // Need to be logged in before creating user
    console.log('[ UserService.createUserinDB()');   
    let nuser = new User().newUser(auth);
    this.upateUserInDB(nuser);
  }

// Helper Methods ===========================================================
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
      routePath = ''+user.profile.userType.toLowerCase();//+'/'v+this.user.getValue().uid;
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
    // user.auth = auth;
    // this.user.next(user);
    console.log('>> updating user auth')
    this.updateUserAuthInDB(user.key, auth);
  }
  getUserProfile():UserProfile { return this.user.getValue().profile; }
  setUserProfile(profile:UserProfile) { 
    let user = this.user.getValue();
    // user.profile = profile;
    // this.user.next(user);
    console.log('>> updating user profile')
    this.updateUserProfileInDB(user.key, profile);    
  }
  getUserListo() { return this.userListfbo; }

// Test methods ===============================================================
  testJUser() {
    // let user = JSON.stringify(this.user.getValue());
    return JSON.stringify(this.user.getValue())
                        .replace(' ', ' ')
                        .replace('\n', '<br>')
                        .replace(',', ',<br>')
                        .replace('}', '}<br>');
    }

}