import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BlogCategoryService } from './blog-category.service';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@ApiTags('blog-categories')
@ApiBearerAuth()
@Controller('blog-categories')
export class BlogCategoriesController {
    constructor(private readonly blogCategoryService: BlogCategoryService) {}

    @Get('')
    async cFilterBlogCategories(@Res() res: Response) {
        const categories = await this.blogCategoryService.getAllBlogCategories();
        return res.send(categories);
    }
}
