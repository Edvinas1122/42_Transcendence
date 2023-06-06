import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Relationship } from '../users/profile-management/entities/relationship.entity';
import { Chat } from '../chat/entities/chat.entity';
import { Message } from '../chat/entities/message.entity';
import { Participant } from '../chat/entities/participants.entity';
import { Admin } from '../chat/entities/admin.entity';
import { Invited } from '../chat/entities/invited.entity';
import { Blocked } from '../chat/entities/blocked.entity';
import { Muted } from '../chat/entities/muted.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
	type: 'postgres',
	host: process.env.DB_HOST || 'db',
	port: parseInt(process.env.DB_PORT, 10) || 5432,
	username: process.env.POSTGRES_USER || 'postgres',
	password: process.env.POSTGRES_PASSWORD || 'example',
	database: process.env.POSTGRES_DB || 'transcendence',
	entities: [User, Relationship, Chat,
		Message, Participant, Admin,
		Invited, Blocked, Muted],
	synchronize: true,
	// logging: true // Add this line
};