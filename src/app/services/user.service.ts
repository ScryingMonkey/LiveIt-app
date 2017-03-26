import { Injectable } from '@angular/core';
import { AngularFire,FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2';
import { BehaviorSubject } from "rxjs/Rx";

import { User, UserAuth, UserProfile } from '../models/index';


@Injectable()
export class UserService {
  private user: BehaviorSubject<User> = new BehaviorSubject(new User());
  private fbuserref: FirebaseListObservable<any[]>;

  constructor( 
    private _af: AngularFire
    ){
      console.log('[ UserService.constructor()');
      this.fbuserref = _af.database.list('/users');
    }
  createUser(user:User) {
    // TODO need to be logged in before creating user
    console.log('[ UserService.createUser()');   
    let key1 = user.auth.email;
    let sendobject = user
    sendobject['key'] = key1; 
    console.log('sendobject:');
    console.dir(sendobject);
    this.fbuserref.push(sendobject)
      .then(res => console.log('success for '+user+''+res))
      .catch(err => console.log(err,'error: '+err));
  }
  retrieveUser(){}
}
