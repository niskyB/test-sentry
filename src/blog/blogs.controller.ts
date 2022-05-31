import { FilterBlogsDTO, vFilterBlogsDTO } from './dto';
import { QueryJoiValidatorPipe } from './../core/pipe';
import { MarketingGuard } from './../auth/guard';
import { BlogService } from './blog.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, UsePipes, Res, UseGuards, Get, Query } from '@nestjs/common';
import { Response } from 'express';

@ApiTags('blogs')
@ApiBearerAuth()
@UseGuards(MarketingGuard)
@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogService: BlogService) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vFilterBlogsDTO))
    async cFilterSliders(@Res() res: Response, @Query() queries: FilterBlogsDTO) {
        const { title, userId, createdAt, currentPage, pageSize, isShow, category } = queries;

        const result = await this.blogService.filterBlogs(title, userId, createdAt, currentPage, pageSize, isShow, category);
        return res.send(result);
    }
}
