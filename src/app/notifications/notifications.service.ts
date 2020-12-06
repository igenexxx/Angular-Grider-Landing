import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { scan } from 'rxjs/operators';

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Clear = 'clear'
}

export interface Command {
  id: number;
  type: NotificationType,
  text?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  messagesSubject: ReplaySubject<Command>;
  messages: Observable<Command[]>;

  constructor() {
    this.messagesSubject = new ReplaySubject<Command>();
    this.messages = this.messagesSubject.asObservable().pipe(
      scan<Command, Command[]>((messages, command) => {
        if (command.type === NotificationType.Clear) {
          return messages.filter(message => message.id !== command.id);
        } else {
          return [...messages, command];
        }
      }, [])
    );
  }

  addSuccess(message: string) {
    const id = this.randomId();
    this.messagesSubject.next({
      id,
      text: message,
      type: NotificationType.Success
    });

    this.timeOut(id);
  }

  addError(message: string) {
    const id = this.randomId();
    this.messagesSubject.next({
      id,
      text: message,
      type: NotificationType.Error
    });

    this.timeOut(id);
  }

  clearMessage(id: number) {
    this.messagesSubject.next({
      id,
      type: NotificationType.Clear
    })
  }

  private timeOut(id: number): void {
    setTimeout(this.clearMessage.bind(this), 5000, id);
  }

  private randomId(): number {
    return Math.round(Math.random() * 10000);
  }
}
