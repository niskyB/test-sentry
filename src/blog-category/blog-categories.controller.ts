import { AdminGuard } from './../auth/guard';
import { QueryJoiValidatorPipe } from './../core/pipe';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BlogCategoryService } from './blog-category.service';
import { Controller, Get, Query, Res, UseGuards, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { FilterSystemSettingsDTO, vFilterSystemSettingsDTO } from '../core/dto';

@ApiTags('blog-categories')
@ApiBearerAuth()
@Controller('blog-categories')
export class BlogCategoriesController {
    constructor(private readonly blogCategoryService: BlogCategoryService) {}

    @Get('/admin')
    @UseGuards(AdminGuard)
    @UsePipes(new QueryJoiValidatorPipe(vFilterSystemSettingsDTO))
    async cFilterBlogCategories(@Res() res: Response, @Query() queries: FilterSystemSettingsDTO) {
        const { value, status, currentPage, pageSize, order, orderBy } = queries;
        const result = await this.blogCategoryService.filterBlogCategories(status, value, order, orderBy, currentPage, pageSize);
        return res.send(result);
    }

    @Get('')
    async cGetAllBlogCategories(@Res() res: Response) {
        const categories = await this.blogCategoryService.getAllBlogCategories();
        return res.send(categories);
    }
}
