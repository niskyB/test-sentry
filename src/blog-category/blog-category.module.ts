import { AuthModule } from './../auth/auth.module';
import { UserModule } from './../user/user.module';
import { BlogCategoryRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BlogCategoryController } from './blog-category.controller';
import { BlogCategoryService } from './blog-category.service';
import { BlogCategoriesController } from './blog-categories.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BlogCategoryRepository]), AuthModule, UserModule],
    controllers: [BlogCategoryController, BlogCategoriesController],
    providers: [BlogCategoryService],
    exports: [BlogCategoryService],
})
export class BlogCategoryModule {}
