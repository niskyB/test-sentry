import { Module } from '@nestjs/common';
import { BlogCategoryController } from './blog-category.controller';
import { BlogCategoryService } from './blog-category.service';

@Module({
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService]
})
export class BlogCategoryModule {}
