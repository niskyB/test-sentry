import { BlogCategory } from './../core/models';
import { BlogCategoryRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogCategoryService {
    constructor(private readonly blogCategoryRepository: BlogCategoryRepository) {}

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
}
