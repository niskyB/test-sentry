import { AdminGuard } from './../auth/guard';
import { BlogCategory } from './../core/models';
import { JoiValidatorPipe } from './../core/pipe/validator.pipe';
import { BlogCategoryService } from './blog-category.service';
import { Body, Controller, Post, Put, Res, UseGuards, UsePipes, Param } from '@nestjs/common';
import { Response } from 'express';
import { CreateBlogCategoryDTO as BlogCategoryDTO, vCreateBlogCategoryDTO as vBlogCategoryDTO } from './dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('blog-category')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('blog-category')
export class BlogCategoryController {
    constructor(private readonly blogCategoryService: BlogCategoryService) {}

    @Post('')
    @UsePipes(new JoiValidatorPipe(vBlogCategoryDTO))
    async cCreateBlogCategory(@Res() res: Response, @Body() body: BlogCategoryDTO) {
        const blogCategory = new BlogCategory();
        blogCategory.name = body.name;

        await this.blogCategoryService.saveBlogCategory(blogCategory);

        return res.send(blogCategory);
    }

    @Put('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vBlogCategoryDTO))
    async cUpdateBlogCategory(@Res() res: Response, @Body() body: BlogCategoryDTO, @Param('id') id: string) {
        const blogCategory = await this.blogCategoryService.getBlogCategoryByField('id', id);
        blogCategory.name = body.name;

        await this.blogCategoryService.saveBlogCategory(blogCategory);

        return res.send(blogCategory);
    }
}
