import { FilterBlogsDTO, vFilterBlogsDTO } from './dto';
import { QueryJoiValidatorPipe } from './../core/pipe';
import { BlogService } from './blog.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, UsePipes, Res, Get, Query } from '@nestjs/common';
import { Response } from 'express';

@ApiTags('blogs')
@ApiBearerAuth()
@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogService: BlogService) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vFilterBlogsDTO))
    async cFilterBlogs(@Res() res: Response, @Query() queries: FilterBlogsDTO) {
        const { title, userId, createdAt, currentPage, pageSize, isShow, category, order } = queries;

        const result = await this.blogService.filterBlogs(title, userId, createdAt, currentPage, pageSize, isShow, category, order);
        return res.send(result);
    }
}
