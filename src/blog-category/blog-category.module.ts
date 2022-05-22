import { BlogCategoryRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BlogCategoryController } from './blog-category.controller';
import { BlogCategoryService } from './blog-category.service';

@Module({
    imports: [TypeOrmModule.forFeature([BlogCategoryRepository])],
    controllers: [BlogCategoryController],
    providers: [BlogCategoryService],
    exports: [BlogCategoryService],
})
export class BlogCategoryModule {}
