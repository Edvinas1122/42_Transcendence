import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
	type: 'postgres',
	host: process.env.DB_HOST || 'db',
	port: parseInt(process.env.DB_PORT, 10) || 5432,
	username: process.env.POSTGRES_USER || 'postgres',
	password: process.env.POSTGRES_PASSWORD || 'example',
	database: process.env.POSTGRES_DB || 'transcendence',
	entities: [__dirname + '/../ormEntities/*.entity{.ts,.js}'],
	synchronize: true
};