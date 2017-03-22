import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Subscription} from 'rxjs/subscription';
import { Observable} from 'rxjs/observable';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject } from "rxjs/Rx";
import { Router }   from '@angular/router';

@Injectable() 
export class AuthService {
  // TODO: refactor all subscriptions to return values from current user
  private user: BehaviorSubject<Object> = new BehaviorSubject({});
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
        this.printUserData();
        console.log('...auth == true, updating user data...');
        // initialize local user object
        let keys = ['displayName', 'email', 'photoURL', 'providerId', 'uid'];
        for (let key of keys) { this.userData[key] = 'test';}

        // convert _as.auth object into user object
        for (let key of keys) { 
          this.userData[key] = auth.auth.providerData[0][key]; 
        }
        this.printUserData();

        this.user.next(this.userData);
        this.updateUserData(this.userData);
        
        if (this.userData.providerId == "google.com") {
          this.updateUserKeys(['displayName', 'email'], [true, 'photoURL']);
          console.log('...updated settings for Google login');
        }
        console.log( "......Logged in!  user: " + auth.auth.displayName );
        console.dir( auth.auth );

        console.log('...redirecting to /loggedin');
        this.router.navigate( ['/loggedin'] );

      } else { 
        console.log( '......not logged in' );
        this.user.next( null );
        this.userName.next( "Please Log In" );
        this.isLoggedIn.next( false );
        this.printUserData();
        console.log('...no user.  Redirecting to /logout');
        this.router.navigate( ['/logout'] );
      }
    });  
  }
  loginWithEmail(username, password) {
    this._af.auth.login({
      email: 'username',
      password: 'password',
    },
    {
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
    })
  }
  signUpWithEmail(){
        console.log("TODO: Code this you lazy bastard!");
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
    this.user.complete();
    this.userName.next('Dummy User');
    this.isLoggedIn.next(false);
    this.updateUserKeys(null,[true,'none']);
    this.userPictureURL = 
              "http://png.clipart.me/graphics/thumbs/103/crash-test-dummy_103003187.jpg";
    console.log("...isLoggedIn == " + this.isLoggedIn.value);   
    this.router.navigate( ['/logout'] );
  }
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
      this.userPictureKey = null;
    }
  }
  loginTester() {
    console.log("[ AuthService testing method");
    console.log("......isLoggedIn == " + this.isLoggedIn.value);
    console.log("......logged in user :"+this.userName.value);
    if(this.isLoggedIn.value) { console.dir(this.user.value);
    } else { console.log('......no user'); }
  }
  updateUserData(user) {
    // let userPicKeys = ['photoURL'];
    console.log('[ AuthService.updateUserData');
    this.userName.next( user.displayName );
    this.isLoggedIn.next( true );
    console.log('...userHasPicture :' +this.userHasPicture+ ', userPictureKey : '+this.userPictureKey);
    
    if(this.userHasPicture) {
      this.userPictureURL = user[this.userPictureKey];
      console.log('...userPictureURL :' +user[this.userPictureKey]);       
    }

    this.userListData.next( this.parseUserListData( user, this.liDetailKeys ) );
    this.printUserData();
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