import { Blog } from './../core/models';
import { BlogRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogService {
    constructor(private readonly blogRepository: BlogRepository) {}

    async saveBlog(blog: Blog): Promise<Blog> {
        return await this.blogRepository.save(blog);
    }
}
