import { SortOrder } from './../core/interface';
import { FilterService } from './../core/providers/filter/filter.service';
import { BlogCategory } from './../core/models';
import { BlogCategoryRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';

@Injectable()
export class BlogCategoryService {
    constructor(private readonly blogCategoryRepository: BlogCategoryRepository, private readonly filterService: FilterService) {}

    async saveBlogCategory(blogCategory: BlogCategory): Promise<BlogCategory> {
        return await this.blogCategoryRepository.save(blogCategory);
    }

    async getBlogCategoryByField(field: keyof BlogCategory, value: any): Promise<BlogCategory> {
        return await this.blogCategoryRepository.findOneByField(field, value);
    }

    async getAllBlogCategories(): Promise<BlogCategory[]> {
        return await this.blogCategoryRepository.createQueryBuilder('BlogCategory').getMany();
    }

    async getLastBlogCategory(): Promise<BlogCategory> {
        return await this.blogCategoryRepository.createQueryBuilder('BlogCategory').orderBy('BlogCategory.order', 'DESC').getOne();
    }

    async filterBlogCategories(status: boolean, value: string, order: SortOrder, orderBy: string, currentPage: number, pageSize: number): Promise<{ data: BlogCategory[]; count: number }> {
        let blogCategories, count;
        const isActiveValue = this.filterService.getMinMaxValue(status);
        try {
            blogCategories = await this.blogCategoryRepository
                .createQueryBuilder('BlogCategory')
                .where('BlogCategory.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('BlogCategory.isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('BlogCategory.isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .orderBy(`BlogCategory.${orderBy}`, order)
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = this.blogCategoryRepository
                .createQueryBuilder('BlogCategory')
                .where('BlogCategory.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('BlogCategory.status = :statusMinValue', {
                            statusMinValue: isActiveValue.minValue,
                        }).orWhere('BlogCategory.status = :statusMaxValue', { statusMaxValue: isActiveValue.maxValue });
                    }),
                )
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
        return { data: blogCategories, count };
    }
}
