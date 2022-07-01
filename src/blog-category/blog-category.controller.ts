import { AdminGuard } from './../auth/guard';
import { BlogCategory } from './../core/models';
import { JoiValidatorPipe } from './../core/pipe';
import { BlogCategoryService } from './blog-category.service';
import { Body, Controller, Post, Put, Res, UseGuards, UsePipes, Param, HttpException, Get } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../core/interface';
import { CreateSystemSettingDTO, UpdateSystemSettingDTO, UpdateSystemSettingStatusDTO, vCreateSystemSettingDTO, vUpdateSystemSettingDTO, vUpdateSystemSettingStatusDTO } from '../core/dto';

@ApiTags('blog-category')
@ApiBearerAuth()
@Controller('blog-category')
export class BlogCategoryController {
    constructor(private readonly blogCategoryService: BlogCategoryService) {}

    @UseGuards(AdminGuard)
    @Post('')
    @UsePipes(new JoiValidatorPipe(vCreateSystemSettingDTO))
    async cCreateBlogCategory(@Res() res: Response, @Body() body: CreateSystemSettingDTO) {
        const blogCategory = new BlogCategory();
        blogCategory.description = body.name;
        const lastCategory = await this.blogCategoryService.getLastBlogCategory();
        if (!lastCategory) blogCategory.order = 1;
        else blogCategory.order = lastCategory.order + 1;

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
    @UsePipes(new JoiValidatorPipe(vUpdateSystemSettingDTO))
    async cUpdateBlogCategory(@Res() res: Response, @Body() body: UpdateSystemSettingDTO, @Param('id') id: string) {
        const blogCategory = await this.blogCategoryService.getBlogCategoryByField('id', id);
        blogCategory.description = body.name;

        if (blogCategory.order !== body.order && body.order) {
            const existedOrder = await this.blogCategoryService.getBlogCategoryByField('order', body.order);
            if (existedOrder) throw new HttpException({ order: ResponseMessage.DUPLICATED_ORDER }, StatusCodes.BAD_REQUEST);
        }

        blogCategory.order = body.order;

        try {
            await this.blogCategoryService.saveBlogCategory(blogCategory);
        } catch (err) {
            throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_CATEGORY }, StatusCodes.BAD_REQUEST);
        }

        return res.send(blogCategory);
    }

    @UseGuards(AdminGuard)
    @Put('/isActive/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vUpdateSystemSettingStatusDTO))
    async cUpdateBlogCategoryStatus(@Res() res: Response, @Body() body: UpdateSystemSettingStatusDTO, @Param('id') id: string) {
        const blogCategory = await this.blogCategoryService.getBlogCategoryByField('id', id);
        blogCategory.isActive = body.isActive === null || body.isActive === undefined ? blogCategory.isActive : body.isActive;

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
