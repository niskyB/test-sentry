import { MarketingGuard } from './../auth/guard';
import { S3Service } from 'src/core/providers/s3/s3.service';
import { Blog } from './../core/models';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from './../core/interface';
import { vCreateBlogDTO, CreateBlogDTO } from './dto';
import { JoiValidatorPipe } from './../core/pipe/validator.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, UseInterceptors, UsePipes, Req, Res, Body, UploadedFile, HttpException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { MarketingService } from '../marketing/marketing.service';

@ApiTags('blog')
@ApiBearerAuth()
@UseGuards(MarketingGuard)
@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService, private readonly marketingService: MarketingService, private readonly s3Service: S3Service) {}

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
        newBlog.marketing = customer;
        const result = await this.s3Service.uploadFile(file);
        if (result) newBlog.thumbnailUrl = result.Location;
        else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        await this.blogService.saveBlog(newBlog);

        return res.send(newBlog);
    }
}
