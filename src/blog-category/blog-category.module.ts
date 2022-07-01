import { FilterModule } from './../core/providers/filter/filter.module';
import { BlogCategory } from './../core/models';
import { AuthModule } from './../auth/auth.module';
import { UserModule } from './../user/user.module';
import { BlogCategoryRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BlogCategoryController } from './blog-category.controller';
import { BlogCategoryService } from './blog-category.service';
import { BlogCategoriesController } from './blog-categories.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([BlogCategory]), AuthModule, UserModule, FilterModule],
    controllers: [BlogCategoryController, BlogCategoriesController],
    providers: [BlogCategoryService, { provide: BlogCategoryRepository, useFactory: (connection: Connection) => connection.getCustomRepository(BlogCategoryRepository), inject: [Connection] }],
    exports: [BlogCategoryService],
})
export class BlogCategoryModule {}
