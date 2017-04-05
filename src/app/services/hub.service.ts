import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/Rx";
import { NotificationsService } from '../components/notifications/index';
import { TestService, BarrelOfMonkeysService } from './index';
import { Monkey } from '../components/barrelofmonkeys/index';

@Injectable()
export class HubService {
  public loadingAnimationUrl:String;
  private loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private showBom: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private monkeyReport: Array<string>;

  constructor(
    public _toast:NotificationsService,
    public _test:TestService,
    public _bom:BarrelOfMonkeysService
  ) {
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
    });

    this.loadingAnimationUrl = 'data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==';
   }
   // Login exposures
   setLoading(bool:boolean) { this.loading.next(bool); }
   getLoading() { return this.loading.asObservable(); }
   // Bom exposures
   setShowBom(bool:boolean) { this.showBom.next(bool); }
   getShowBom() { return this.showBom.asObservable(); }
   setMonkeyReport(report:any) { this.monkeyReport = report; }
   getMonkeyReport() { return this.monkeyReport; }
}
