import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/Rx";

import { Notification } from './index';

@Injectable()
export class NotificationsService {
  private notifications: BehaviorSubject<Notification> = new BehaviorSubject(new Notification(false, '','',''));

  constructor() { }
  toast(visible, type, title, message){
    let toast = new Notification(visible, type, title, message);
    this.notifications.next(toast);
  }
  getNotifications() { 
    return this.notifications.asObservable(); 
  }
  testToast() {
    this.toast(true, 'alert', 'Test Message', 'This is a test notification');
  }
}
