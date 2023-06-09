import { Controller, Query, MessageEvent, Res, Sse, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventService } from './events.service';
import * as jwt from 'jsonwebtoken';


@Controller("events")
export class EventsController {
	constructor(private eventService: EventService) {}

	@Sse('sse')
	sse(
		@Res() res: Response,
		@Query('token') token: string,
	): Observable<MessageEvent>
	{
		if (!token)
			throw new HttpException('Token not provided', HttpStatus.UNAUTHORIZED);
		try {
			const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
			const userId = decodedToken['id'];
			this.eventService.connectUser(userId.toString());
			res.on('close', () => {
				this.eventService.disconnectUser(userId.toString());
				res.end();
				console.log('Client disconnected------------------');
			});
			return this.eventService.getUserEventStream(userId.toString()).pipe(
				map(data => ({ data } as MessageEvent)),
			);
		} catch (error) {
			throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
		}
	}
}
