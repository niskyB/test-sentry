import { SortOrder } from './../core/interface';
import { Blog } from './../core/models';
import { BlogRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';

@Injectable()
export class BlogService {
    constructor(private readonly blogRepository: BlogRepository) {}

    async saveBlog(blog: Blog): Promise<Blog> {
        return await this.blogRepository.save(blog);
    }

    async getBlogByField(field: keyof Blog, value: any): Promise<Blog> {
        return await this.blogRepository.findOneByField(field, value);
    }

    getMinMaxValue(value: boolean) {
        if (value === false)
            return {
                minValue: 0,
                maxValue: 0,
            };
        if (value === true)
            return {
                minValue: 1,
                maxValue: 1,
            };
        if (value === null)
            return {
                minValue: 0,
                maxValue: 1,
            };
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
            const activeValue = this.getMinMaxValue(isShow);
            const date = new Date(createdAt);
            let blogs, count;
            if (!userId) {
                blogs = await this.blogRepository
                    .createQueryBuilder('blog')
                    .where(`blog.title LIKE (:title)`, {
                        title: `%${title}%`,
                    })
                    .andWhere(`blog.createdAt >= (:createdAt)`, { createdAt: date })
                    .andWhere(
                        new Brackets((qb) => {
                            qb.where('blog.isShow = :activeMinValue', {
                                activeMinValue: activeValue.minValue,
                            }).orWhere('blog.isShow = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                        }),
                    )
                    .leftJoinAndSelect('blog.category', 'category')
                    .andWhere(`category.id LIKE (:id)`, { id: `%${categoryId}%` })
                    .leftJoinAndSelect('blog.marketing', 'marketing')
                    .leftJoinAndSelect('marketing.user', 'user')
                    .orderBy(`blog.updatedAt`, order)
                    .skip(currentPage * pageSize)
                    .take(pageSize)
                    .getMany();
                count = await this.blogRepository
                    .createQueryBuilder('blog')
                    .where(`blog.title LIKE (:title)`, {
                        title: `%${title}%`,
                    })
                    .andWhere(`blog.createdAt >= (:createdAt)`, { createdAt: date })
                    .andWhere(
                        new Brackets((qb) => {
                            qb.where('blog.isShow = :activeMinValue', {
                                activeMinValue: activeValue.minValue,
                            }).orWhere('blog.isShow = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                        }),
                    )
                    .leftJoinAndSelect('blog.category', 'category')
                    .andWhere(`category.id LIKE (:id)`, { id: `%${categoryId}%` })
                    .leftJoinAndSelect('blog.marketing', 'marketing')
                    .leftJoinAndSelect('marketing.user', 'user')
                    .getCount();
            } else {
                blogs = await this.blogRepository
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
                count = await this.blogRepository
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
            }

            return { data: blogs, count };
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
    }
}
