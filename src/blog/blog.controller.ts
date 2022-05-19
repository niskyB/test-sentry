import { BlogService } from './blog.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('blog')
@ApiBearerAuth()
@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}
}
