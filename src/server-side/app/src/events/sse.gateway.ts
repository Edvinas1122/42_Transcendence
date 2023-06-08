import { Controller, Query, MessageEvent, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventService } from './sse.service';
import * as jwt from 'jsonwebtoken';

@Controller("api")
export class EventsController {
    constructor(private eventService: EventService) {}

    @Sse('sse')
    sse(@Query('token') token: string): Observable<MessageEvent> {
        console.log('sse', token);
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decodedToken['id'];
            console.log(`Client connected: ${userId}`);
            this.eventService.connectUser(userId.toString());
            return this.eventService.getUserEventStream(userId.toString()).pipe(
                map(data => ({ data } as MessageEvent)),
            );
        } catch (error) {
            console.log('Invalid token, disconnecting client...');
			// throw new Error('Invalid token, disconnecting client...');
            return (error);
        }
    }
}
