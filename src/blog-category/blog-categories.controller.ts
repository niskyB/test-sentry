import { BlogCategoryService } from './blog-category.service';
import { Controller } from '@nestjs/common';

@Controller('blog-categories')
export class BlogCategoryController {
    constructor(private readonly blogCategoryService: BlogCategoryService) {}
}
