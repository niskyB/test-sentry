import { BlogCategory } from './core/models/blog-category';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './core';
import { User, Slider, Role, Customer, Marketing, Blog, Admin, Sale, Expert } from './core/models';

export const DbModule = TypeOrmModule.forRoot({
    type: 'mysql',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    synchronize: true,
    keepConnectionAlive: true,
    entities: [User, Role, Slider, Customer, Marketing, Blog, BlogCategory, Admin, Sale, Expert],
    extra: { connectionLimit: 1 },
});
