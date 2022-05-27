import { Blog } from './../core/models';
import { BlogRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogService {
    constructor(private readonly blogRepository: BlogRepository) {}

    async saveBlog(blog: Blog): Promise<Blog> {
        return await this.blogRepository.save(blog);
    }

    async getBlogByField(field: keyof Blog, value: any): Promise<Blog> {
        return await this.blogRepository.findOneByField(field, value);
    }

    async filterBlogs(title: string, userId: string, createdAt: string, currentPage: number, pageSize: number, isShow: boolean, categoryId: string): Promise<{ data: Blog[]; count: number }> {
        try {
            const date = new Date(createdAt);
            const sliders = await this.blogRepository
                .createQueryBuilder('blog')
                .where(`blog.title LIKE (:title)`, {
                    title: `%${title}%`,
                })
                .andWhere(`blog.createdAt >= (:createdAt)`, { createdAt: date })
                .andWhere(`blog.isShow = (:isShow)`, { isShow: isShow })
                .leftJoinAndSelect('blog.category', 'category')
                .andWhere(`category.id LIKE (:id)`, { id: `%${categoryId}%` })
                .leftJoinAndSelect('blog.marketing', 'marketing')
                .leftJoinAndSelect('marketing.user', 'user')
                .andWhere('user.id LIKE (:userId)', { userId: `%${userId}%` })
                .orderBy(`blog.createdAt`, 'DESC')
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            const count = await this.blogRepository
                .createQueryBuilder('blog')
                .where(`blog.title LIKE (:title)`, {
                    title: `%${title}%`,
                })
                .andWhere(`blog.createdAt >= (:createdAt)`, { createdAt: date })
                .andWhere(`blog.isShow = (:isShow)`, { isShow: isShow })
                .leftJoinAndSelect('blog.category', 'category')
                .andWhere(`category.id LIKE (:id)`, { id: `%${categoryId}%` })
                .leftJoinAndSelect('blog.marketing', 'marketing')
                .leftJoinAndSelect('marketing.user', 'user')
                .andWhere('user.id LIKE (:userId)', { userId: `%${userId}%` })
                .getCount();

            return { data: sliders, count };
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
    }
}
