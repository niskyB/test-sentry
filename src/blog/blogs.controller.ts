import { FilterBlogsDTO, vFilterBlogsDTO } from './dto';
import { QueryJoiValidatorPipe } from './../core/pipe';
import { UserService } from './../user/user.service';
import { MarketingGuard } from './../auth/guard';
import { BlogService } from './blog.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, UsePipes, Req, Res, UseGuards, Get, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { MarketingService } from '../marketing/marketing.service';

@ApiTags('blogs')
@ApiBearerAuth()
@UseGuards(MarketingGuard)
@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogService: BlogService, private readonly marketingService: MarketingService, private readonly userService: UserService) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vFilterBlogsDTO))
    async cFilterSliders(@Req() req: Request, @Res() res: Response, @Query() queries: FilterBlogsDTO) {
        const { title, userId, createdAt, currentPage, pageSize, isShow, category } = queries;

        const result = await this.blogService.filterBlogs(title, userId, createdAt, currentPage, pageSize, isShow, category);
        return res.send(result);
    }
}
