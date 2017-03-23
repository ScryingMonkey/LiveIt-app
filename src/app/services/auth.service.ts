import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Subscription} from 'rxjs/subscription';
import { Observable} from 'rxjs/observable';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject } from "rxjs/Rx";
import { Router }   from '@angular/router';
import { User } from '../models/index';

@Injectable() 
export class AuthService {
  // TODO: refactor all subscriptions to return values from current user
  private user: BehaviorSubject<User> = new BehaviorSubject(this.initializeEmptyUser());
  private userName: BehaviorSubject<string> = new BehaviorSubject('???');
  private userListData: BehaviorSubject<any> = new BehaviorSubject({});
  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private userKeys: BehaviorSubject<Object> = new BehaviorSubject({});  
  private userPictureURL: string = "http://png.clipart.me/graphics/thumbs/103/crash-test-dummy_103003187.jpg";
  public userData: any = {};
  private userHasPicture: boolean = false;
  public userPictureKey: string = 'none';
  private liDetailKeys: Array<string> = new Array('displayName', 'email');

  constructor (private _af: AngularFire, private router: Router ){
    console.log('[ AuthService.constructor');
    // subscribe to auth object
    this._af.auth.subscribe(auth => {
      console.log("[ AuthService.constructor._af.auth.subscription");
      if(auth) {
        console.log('...auth == true, updating user data...');
        let newUser = this.initializeEmptyUser();
        // TODO: Pull user from firebase database and set userType correctly
        newUser.userType = 'Coach';
        this.updateUserFromAuth(newUser,auth.auth); // update user object from from auth.auth       
        this.user.next(newUser) // Update global user observable from user object
        this.updateUserData(newUser); // Update global user details.  userName, isLoggedIn, userHadPicture, userPictureURL, userListData
        this.printUserData(); // print global user observable to make sure everything is updated
        console.log( "......Logged in!  user: " + auth.auth.displayName ); console.dir( auth.auth );
        // TODO: Route user by type and uid
        let routePath = ''+this.user.getValue().userType//+'/'v+this.user.getValue().uid;  // create route path from user userType
        // Route view to appropriate landing page
        console.log('...redirecting to '+routePath);
        this.router.navigate( [routePath] );

      } else { // if no auth object exists
        console.log( '......not logged in' );
        this.user.next( null );
        this.updateUserData( null );
        this.printUserData();
        console.log('...no user.  Redirecting to /logout');
        this.router.navigate( ['/logout'] );
      }
    } );
  }
  loginWithEmail(email, password) {
    console.log("Signing in with email:"+email);
    this._af.auth.login({
      email: email,
      password: password,
    },
    {
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
    })
  }
  signUpWithEmail(email:string, password:string){
      console.log("TODO: Code this you lazy bastard!");
      console.log('>> Signing up new email user:'+email);      
      this._af.auth.createUser({ email: email, password: password });
  }
  loginWithFacebook() {
    this._af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup,
    });
    this.updateUserKeys(['displayName', 'email'], [true, 'photoURL']);
    console.log('...updated settings for Google login');
  }
  loginWithGoogle() {
    this._af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
    });
    this.updateUserKeys(['displayName', 'email'],[true,'photoURL']);
    console.log('...updated settings for Google login');
  }
  logout() {
    console.log("[ AuthService.logout()");
    this._af.auth.logout();
    this.user.next( null );
    this.updateUserData( null );
    this.updateUserKeys(null,[true,'none']);
    this.printUserData();
    this.user.complete();
    console.log("...isLoggedIn == " + this.isLoggedIn.value);   
    this.router.navigate( ['/logout'] );
  }

// User update pipeline =============================================================
  updateUserFromAuth(user,auth){
  // Summary method for user update pipeline.
    console.log('[ AuthService.updateUserFromAuth('+user+','+auth+')');
    // Convert _as.auth object into user object
    user = this.updateUserFromAuthObj(user,auth);
    // determine what type of user this is
    user = this.getUserType(user);    
    // determine auth provider from auth object
    user = this.parseAuthProviderAndUpdateKeys(user);
    console.log( "......retrieved new user from auth: " + user.displayName );
    console.dir( user );
    return user;
  }
  initializeEmptyUser(){
    return new User('', '', false, '', '', '', '')
  }
  updateUserFromAuthObj(user,authObj){
  // Update user object from auth.auth object from firebase
    console.log('[ AuthService.updateUserFromAuthObj('+user+','+authObj+')');
    console.dir(user);
    console.dir(authObj);
    let keys = ['displayName', 'email', 'photoURL', 'providerId', 'uid'];
    for (let key of keys) { 
      user[key] = authObj.providerData[0][key]; 
    }
    return user;
  }
  getUserType(user:User){
    let types = ['user','coach','newcoach'];
    let r = Math.floor(Math.random()*types.length);
    user.userType = types[r];
    return user;
  }
  parseAuthProviderAndUpdateKeys(user){
  // determine auth provider from user object and update user keys to fit provider
    let userKeys = {}
    if (user.providerId == "google.com") {
      // TODO: Deprecate userKeys global obsevable in favor of attaching keys to user object
      this.updateUserKeys(['displayName', 'email'], [true, 'photoURL']);
      user.userHasPicture = true;
      user.userPictureKey = 'photoURL';
      console.log('...updated user for Google login');
    } else if (user.providerId == 'password'){
      this.updateUserKeys(['displayName', 'email'], [false, 'none']);
      user.userHasPicture = false;
      user.userPictureKey = '';
      console.log('...updated user for Email login');
    } else if (user.providerId.length > 1) {
      console.log('ERROR: User email is empty!');          
    } else {
      console.log('ERROR: Could not parse auth provider!');
    }
    return user;
  }
  // TODO: Deprecate userKeys global obsevable in favor of attaching keys to user object
  updateUserKeys(liDetailKeys:Array<string>, userHasPicture:Array<any>){
  // updates user values.  assumes that user is logged in.
  // loggedIn([key for user name in this.user, key for email address in this.user], [boolean for whether this.user includes a profile picture, url to picture or empty]);
  // ex. loggedIn(['displayName', 'email'], [true, 'photoURL']){
    this.liDetailKeys = liDetailKeys;
    if(userHasPicture[0]){
      this.userHasPicture = userHasPicture[0];
      this.userPictureKey = userHasPicture[1];
    } else {
      this.userHasPicture = userHasPicture[0];
      this.userPictureKey = '';
    }
  }
  updateUserData(user:User) {
  // Update global user details.  userName, isLoggedIn, userHadPicture, userPictureURL, userListData
    console.log('[ AuthService.updateUserData');
    if (user == null){
      user = new User('Please Log In','',false,'','','',''); 
      this.isLoggedIn.next( false );
    } else {
      this.isLoggedIn.next( true );
    }
    // update displayName observable from given user
    this.userName.next( user.displayName );
    // update userHasPicture boolean observable from given user if it exists
    if(user.userHasPicture) {
      this.userPictureURL = user[this.userPictureKey];
      console.log('...userHasPicture :' +this.userHasPicture+ ', userPictureKey : '+this.userPictureKey);
      console.log('...userPictureURL :' +user[this.userPictureKey]);       
    } else {
      this.userPictureURL = "http://png.clipart.me/graphics/thumbs/103/crash-test-dummy_103003187.jpg";
    }
    this.userListData.next( this.parseUserListData( user, this.liDetailKeys ) );
    this.printUserData();
    return user;
  }
  parseUserListData(user, userDetailKeys: Array<string>) {
  // parse data from _as.auth object into different local variables
    // Must return an object that fits listdata.interface
    // listTitle: string : 'Test Data'
    // userPictureURL: string : 'https://somepicture.jpg',
    // liTitleKey: string : 'liTitle' 
    // liDetailKeys: Array<string> : [ 'detail1', 'detail2', 'detail3']
    // liItems: Array<Object> : [{'liTitle': 'liTitle3' , 'detail1':10485, 'detail2':3409, 'detail3':245}]
    console.log('[ AuthService.parseUserListData');
    // Define fields
    let listTitle: string = 'User Details';
    let userPictureURL: string = user[this.userPictureKey];
    let liTitleKey: string = 'liTitle';
    let liDetailKeys: Array<string> = [];
    let liItems: Array<Object> = [];
    // Define output object
    let listData: Object = {};
    // Populate liItems array
    // listData is designed to list several objects with associated details.
    // For this use, listItems should be an array of objects, each with a single element
    // with a key of liTitle.
    for(let key of userDetailKeys) {
       if(user[key]) {
         liItems.push( { [key]: user[key]} ); 
       }
    }
    // Build dataList object
    listData = {'listTitle': listTitle,
                'userPictureURL': userPictureURL,   
                'liTitleKey': liTitleKey,
                'liDetailKeys': liDetailKeys,
                'liItems': liItems 
              };
    // Print new object to console
    console.log('...parseUserListData complete, listData :');
    console.dir(listData);
    return listData;
  }
  // Testing methods ==============================================================
  loginTester() {
    console.log("[ AuthService testing method");
    console.log("......isLoggedIn == " + this.isLoggedIn.value);
    console.log("......logged in user :"+this.userName.value);
    if(this.isLoggedIn.value) { console.dir(this.user.value);
    } else { console.log('......no user'); }
  }
  
  // Getters
  get user$() { return this.user.asObservable(); }
  get userName$() { return this.userName.asObservable(); }
  get isLoggedIn$() { return this.isLoggedIn.asObservable(); }
  get userListData$() { return this.userListData.asObservable(); }
  // get userPictureURL$() { return this.userPictureURL.asObservable(); }
  get userKeys$() { return this.userKeys.asObservable(); }
  get dummyUser() { 
    let du = {};
    let keys = ['displayName', 'email', 'photoURL', 'providerId', 'uid'];
    for (let key of keys) { du[key] = 'test';}
    return du;
  }

  //testers
  printUserData() { 
    console.log('...user:');
    console.dir(this.user.value);
   }
} 