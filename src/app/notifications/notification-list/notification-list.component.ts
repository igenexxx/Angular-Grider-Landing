import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Command, NotificationsService, NotificationType } from '../notifications.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  messages: Observable<Command[]>
  NotificationType = NotificationType;

  constructor(private notificationsService: NotificationsService) {
    this.messages = notificationsService.messages;
  }

  ngOnInit(): void {
  }

  clearMessage(id: number): void {
    this.notificationsService.clearMessage(id);
  }
}
