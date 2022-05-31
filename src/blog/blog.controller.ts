import { BlogCategoryService } from './../blog-category/blog-category.service';
import { UserService } from './../user/user.service';
import { MarketingGuard } from './../auth/guard';
import { S3Service } from 'src/core/providers/s3/s3.service';
import { Blog, UserRole } from './../core/models';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from './../core/interface';
import { vCreateBlogDTO, CreateBlogDTO, vUpdateBlogDTO, UpdateBlogDTO } from './dto';
import { JoiValidatorPipe } from './../core/pipe/validator.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, UseInterceptors, UsePipes, Req, Res, Body, UploadedFile, HttpException, UseGuards, Put, Param, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { MarketingService } from '../marketing/marketing.service';

@ApiTags('blog')
@ApiBearerAuth()
@UseGuards(MarketingGuard)
@Controller('blog')
export class BlogController {
    constructor(
        private readonly blogService: BlogService,
        private readonly marketingService: MarketingService,
        private readonly s3Service: S3Service,
        private readonly userService: UserService,
        private readonly blogCategoryService: BlogCategoryService,
    ) {}

    @Get('/:id')
    async cGetSlider(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        const blog = await this.blogService.getBlogByField('id', id);
        if (!blog) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        return res.send(blog);
    }

    @Post('')
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vCreateBlogDTO))
    async cCreateSlider(@Req() req: Request, @Res() res: Response, @Body() body: CreateBlogDTO, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new HttpException({ errorMessage: ResponseMessage.INVALID_IMAGE }, StatusCodes.BAD_REQUEST);

        const customer = await this.marketingService.getMarketingByUserId(req.user.id);
        const newBlog = new Blog();
        newBlog.title = body.title;
        newBlog.details = body.details;
        newBlog.briefInfo = body.briefInfo;

        const blogCategory = await this.blogCategoryService.getBlogCategoryByField('id', body.categoryId);
        if (!blogCategory) throw new HttpException({ category: ResponseMessage.INVALID_CATEGORY }, StatusCodes.BAD_REQUEST);
        newBlog.category = blogCategory;

        newBlog.marketing = customer;
        const result = await this.s3Service.uploadFile(file);
        if (result) newBlog.thumbnailUrl = result.Location;
        else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        await this.blogService.saveBlog(newBlog);

        return res.send(newBlog);
    }

    @Put('/:id')
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vUpdateBlogDTO))
    async cUpdateBlog(@Param('id') id: string, @Req() req: Request, @Res() res: Response, @Body() body: UpdateBlogDTO, @UploadedFile() file: Express.Multer.File) {
        const user = await this.userService.findUser('id', req.user.id);
        const blog = await this.blogService.getBlogByField('id', id);

        if (!blog) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        if (user.role.name !== UserRole.ADMIN && blog.marketing.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        blog.title = body.title || blog.title;
        blog.briefInfo = body.briefInfo || blog.briefInfo;
        blog.details = body.details || blog.details;
        blog.isShow = body.isShow === null || body.isShow === undefined ? blog.isShow : body.isShow;

        const blogCategory = await this.blogCategoryService.getBlogCategoryByField('id', body.category);
        if (!blogCategory) throw new HttpException({ category: ResponseMessage.INVALID_CATEGORY }, StatusCodes.BAD_REQUEST);
        blog.category = blogCategory;

        if (file) {
            const result = await this.s3Service.uploadFile(file);
            if (result) blog.thumbnailUrl = result.Location;
            else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        await this.blogService.saveBlog(blog);

        return res.send(blog);
    }
}
