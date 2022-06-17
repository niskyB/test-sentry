import { AdminGuard } from './../auth/guard';
import { BlogCategory } from './../core/models';
import { JoiValidatorPipe } from './../core/pipe';
import { BlogCategoryService } from './blog-category.service';
import { Body, Controller, Post, Put, Res, UseGuards, UsePipes, Param, HttpException, Get } from '@nestjs/common';
import { Response } from 'express';
import { CreateBlogCategoryDTO as BlogCategoryDTO, vCreateBlogCategoryDTO as vBlogCategoryDTO } from './dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../core/interface';

@ApiTags('blog-category')
@ApiBearerAuth()
@Controller('blog-category')
export class BlogCategoryController {
    constructor(private readonly blogCategoryService: BlogCategoryService) {}

    @UseGuards(AdminGuard)
    @Post('')
    @UsePipes(new JoiValidatorPipe(vBlogCategoryDTO))
    async cCreateBlogCategory(@Res() res: Response, @Body() body: BlogCategoryDTO) {
        const blogCategory = new BlogCategory();
        blogCategory.description = body.name;

        try {
            await this.blogCategoryService.saveBlogCategory(blogCategory);
        } catch (err) {
            throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_CATEGORY }, StatusCodes.BAD_REQUEST);
        }

        return res.send(blogCategory);
    }

    @UseGuards(AdminGuard)
    @Put('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vBlogCategoryDTO))
    async cUpdateBlogCategory(@Res() res: Response, @Body() body: BlogCategoryDTO, @Param('id') id: string) {
        const blogCategory = await this.blogCategoryService.getBlogCategoryByField('id', id);
        blogCategory.description = body.name;

        try {
            await this.blogCategoryService.saveBlogCategory(blogCategory);
        } catch (err) {
            throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_CATEGORY }, StatusCodes.BAD_REQUEST);
        }

        return res.send(blogCategory);
    }

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetBlogCategoryById(@Res() res: Response, @Param('id') id: string) {
        const blogCategory = await this.blogCategoryService.getBlogCategoryByField('id', id);

        if (!blogCategory) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        return res.send(blogCategory);
    }
}
