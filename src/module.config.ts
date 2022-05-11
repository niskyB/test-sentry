import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './core';
import { User } from './core/models';

export const DbModule = TypeOrmModule.forRoot({
    type: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    synchronize: true,
    keepConnectionAlive: true,
    entities: [User],
    extra: { connectionLimit: 1 },
});
