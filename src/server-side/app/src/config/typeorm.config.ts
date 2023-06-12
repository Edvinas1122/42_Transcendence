import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Relationship } from '../users/profile-management/entities/relationship.entity';
import { Chat } from '../chat/entities/chat.entity';
import { Message } from '../chat/entities/message.entity';
import { Role } from '../chat/entities/role.entity';
import { Event } from '../events/entities/event.entity';
export const typeOrmConfig: TypeOrmModuleOptions = {
	type: 'postgres',
	host: process.env.DB_HOST || 'db',
	port: parseInt(process.env.DB_PORT, 10) || 5432,
	username: process.env.POSTGRES_USER || 'postgres',
	password: process.env.POSTGRES_PASSWORD || 'example',
	database: process.env.POSTGRES_DB || 'transcendence',
	entities: [User, Relationship, Chat,
		Message, Role, Event],
	synchronize: true,
	// logging: true // Add this line
};