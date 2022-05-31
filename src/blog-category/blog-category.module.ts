import { BlogCategoryRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BlogCategoryController } from './blog-category.controller';
import { BlogCategoryService } from './blog-category.service';
import { BlogCategoriesController } from './blog-categories.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BlogCategoryRepository])],
    controllers: [BlogCategoryController, BlogCategoriesController],
    providers: [BlogCategoryService],
    exports: [BlogCategoryService],
})
export class BlogCategoryModule {}
