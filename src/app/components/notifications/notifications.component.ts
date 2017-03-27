import { Component, OnInit } from '@angular/core';
import { NotificationsService, Notification } from './index';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notification: Notification = new Notification(false,'','','');

  constructor( private _toast: NotificationsService ) {
    this._toast.getNotifications().subscribe(
      (res:Notification)=> this.notification = res
      );
   }

  ngOnInit() {  }

}
