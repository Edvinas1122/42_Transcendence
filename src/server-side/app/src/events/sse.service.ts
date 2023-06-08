import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class EventService {
  private eventSubjects = new Map<string, Subject<any>>();

  connectUser(userId: string) {
    this.eventSubjects.set(userId, new Subject<any>());
  }

  disconnectUser(userId: string) {
    console.log('disconnectUser', userId);
    this.eventSubjects.get(userId)?.complete();
    this.eventSubjects.delete(userId);
  }

  sendEventToUser(userId: string, data: any) {
    console.log('sendEventToUser', userId, data);
    this.eventSubjects.get(userId)?.next({ data });
  }

  getUserEventStream(userId: string) {
    return this.eventSubjects.get(userId)?.asObservable();
  }
}