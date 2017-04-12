import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/Rx";
import { NotificationsService } from '../components/notifications/index';
import { TestService, BarrelOfMonkeysService, UserService, AuthService } from './index';
import { Monkey, UserProfile } from '../models/index';

@Injectable()
export class HubService {
  public loadingAnimationUrl:String;
  private loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private showBom: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private monkeyReport: Array<string>;
  
// Constructor and all subscribtion ===========================================
  constructor(
    public _toast:NotificationsService,
    public _test:TestService,
    public _bom:BarrelOfMonkeysService,
    public _user:UserService,
    public _auth:AuthService
  ) {
    this._auth.getErrorao$().subscribe(err =>{
      if(err){ this._toast.toast(true, 'error', 'Error:'+err.name, err.message); 
      } else { this._toast.toast(false, 'error', 'Error', 'Wrong password.'); 
      }
    });
    this._user.getUserao$().subscribe( res=>{
      console.log('[ _hub > _bom.constructor().showBom updated.  Now:'+res);
      if(res.auth.uid != null){ this.setLoading(false); }
    })
    this._bom.getShowBom$().subscribe( res => {
      console.log('[ _hub > _bom.constructor().showBom updated.  Now:'+res);
      this.showBom.next(res);
    });

    this._bom.getMonkeyReport$().subscribe( res => {
        console.log('[ _hub > _bom.constructor().monkeyReport updated.');
        this.monkeyReport = res;
    }, err => { 
        console.log('>> Error in monkeyReport:'+err);
    }, () => { // do something when bom completes
        console.log('...monkeyReport is final.');
        let profile:UserProfile = this._user.getUserProfile();
        let monkeyReport:Array<Monkey> = this._bom.getFinalMonkeyReport();
        // update user from the results of monkey report after it is final
        monkeyReport.forEach(m => { 
          console.log('>> profile['+m.key+'] = '+m.responses+' <<');
          let profile = this._user.getUser().profile;
          profile[m.key] = m.responses[0]; 
          if (m.key == 'userType' && m.responses[0] == 'Coach'){ profile.isCoach == true; }
          if (m.key == 'userType' && m.responses[0] == 'Member'){ profile.isCoach == false; }
        });
        profile.needInfo = false;

        console.log('...updated profile');
        console.dir(profile);
        this._user.setUserProfile(profile);
        this._user.buildRoutePath(this._user.getUser());
    });

    this.loadingAnimationUrl = 'data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==';
   }
// Login exposures ==================================================================
   setLoading(bool:boolean) { this.loading.next(bool); }
   getLoading() { return this.loading.asObservable(); }

// Bom exposures ==================================================================
   setShowBom(bool:boolean) { this.showBom.next(bool); }
   getShowBom() { return this.showBom.asObservable(); }
   setMonkeyReport(report:any) { this.monkeyReport = report; }
   getMonkeyReport() { return this.monkeyReport; }
}
