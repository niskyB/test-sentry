import { BlogCategory } from './../core/models';
import { JoiValidatorPipe } from './../core/pipe/validator.pipe';
import { BlogCategoryService } from './blog-category.service';
import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { CreateBlogCategoryDTO, vCreateBlogCategoryDTO } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('blog-category')
@ApiBearerAuth()
@Controller('blog-category')
export class BlogCategoryController {
    constructor(private readonly blogCategoryService: BlogCategoryService) {}

    @Post('')
    @UsePipes(new JoiValidatorPipe(vCreateBlogCategoryDTO))
    async cCreateSlider(@Res() res: Response, @Body() body: CreateBlogCategoryDTO) {
        const blogCategory = new BlogCategory();
        blogCategory.name = body.name;

        await this.blogCategoryService.saveBlogCategory(blogCategory);

        return res.send(blogCategory);
    }
}
