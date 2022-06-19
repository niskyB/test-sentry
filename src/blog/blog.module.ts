import { FilterModule } from './../core/providers/filter/filter.module';
import { Blog } from './../core/models';
import { BlogCategoryModule } from './../blog-category/blog-category.module';
import { S3Module } from '../core/providers/s3/s3.module';
import { MarketingModule } from './../marketing/marketing.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { BlogRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogsController } from './blogs.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Blog]), AuthModule, UserModule, MarketingModule, S3Module, BlogCategoryModule, FilterModule],
    controllers: [BlogController, BlogsController],
    providers: [BlogService, { provide: BlogRepository, useFactory: (connection: Connection) => connection.getCustomRepository(BlogRepository), inject: [Connection] }],
    exports: [BlogService],
})
export class BlogModule {}
