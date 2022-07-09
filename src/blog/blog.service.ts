import { FilterService } from './../core/providers';
import { SortOrder } from './../core/interface';
import { Blog } from './../core/models';
import { BlogRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';

@Injectable()
export class BlogService {
    constructor(private readonly blogRepository: BlogRepository, private readonly filterService: FilterService) {}

    private filterBlog = this.blogRepository
        .createQueryBuilder('blog')
        .leftJoinAndSelect('blog.category', 'category')
        .leftJoinAndSelect('blog.marketing', 'marketing')
        .leftJoinAndSelect('marketing.user', 'user');

    async saveBlog(blog: Blog): Promise<Blog> {
        return await this.blogRepository.save(blog);
    }

    async getBlogByField(field: keyof Blog, value: any): Promise<Blog> {
        return await this.blogRepository.findOneByField(field, value);
    }

    async filterBlogs(
        title: string,
        userId: string,
        createdAt: string,
        currentPage: number,
        pageSize: number,
        isShow: boolean,
        categoryId: string,
        order: SortOrder,
    ): Promise<{ data: Blog[]; count: number }> {
        try {
            const activeValue = this.filterService.getMinMaxValue(isShow);
            const date = new Date(createdAt);
            let blogs, count;

            let query = this.filterBlog
                .where(`blog.title LIKE (:title)`, { title: `%${title}%` })
                .andWhere(`blog.createdAt >= (:createdAt)`, { createdAt: date })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('blog.isShow = :activeMinValue', {
                            activeMinValue: activeValue.minValue,
                        }).orWhere('blog.isShow = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                    }),
                )
                .andWhere(`category.id LIKE (:id)`, { id: `%${categoryId}%` });

            if (!userId) {
                blogs = await query
                    .orderBy(`blog.updatedAt`, order)
                    .skip(currentPage * pageSize)
                    .take(pageSize)
                    .getMany();

                count = await query.getCount();
            } else {
                query = query.andWhere('user.id LIKE (:userId)', { userId: `%${userId}%` });

                blogs = await query
                    .orderBy(`blog.updatedAt`, 'DESC')
                    .skip(currentPage * pageSize)
                    .take(pageSize)
                    .getMany();

                count = await query.getCount();
            }

            return { data: blogs, count };
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
    }
}
