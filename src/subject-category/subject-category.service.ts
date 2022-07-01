import { Brackets } from 'typeorm';
import { FilterService } from './../core/providers/filter/filter.service';
import { SortOrder } from './../core/interface';
import { SubjectCategory } from './../core/models';
import { SubjectCategoryRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubjectCategoryService {
    constructor(private readonly subjectCategoryRepository: SubjectCategoryRepository, private readonly filterService: FilterService) {}

    async saveSubjectCategory(subjectCategory: SubjectCategory): Promise<SubjectCategory> {
        return await this.subjectCategoryRepository.save(subjectCategory);
    }

    async getSubjectCategoryByField(field: keyof SubjectCategory, value: any): Promise<SubjectCategory> {
        return await this.subjectCategoryRepository.findOneByField(field, value);
    }

    async getAllSubjectCategories(): Promise<SubjectCategory[]> {
        return await this.subjectCategoryRepository.createQueryBuilder('SubjectCategory').getMany();
    }

    async getLastSubjectCategory(): Promise<SubjectCategory> {
        return await this.subjectCategoryRepository.createQueryBuilder('SubjectCategory').orderBy('SubjectCategory.order', 'DESC').getOne();
    }

    async filterSubjectCategories(status: boolean, value: string, order: SortOrder, orderBy: string, currentPage: number, pageSize: number): Promise<{ data: SubjectCategory[]; count: number }> {
        let blogCategories, count;
        const isActiveValue = this.filterService.getMinMaxValue(status);
        try {
            blogCategories = await this.subjectCategoryRepository
                .createQueryBuilder('SubjectCategory')
                .where('SubjectCategory.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('SubjectCategory.isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('SubjectCategory.isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .orderBy(`SubjectCategory.${orderBy}`, order)
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = this.subjectCategoryRepository
                .createQueryBuilder('SubjectCategory')
                .where('SubjectCategory.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('SubjectCategory.status = :statusMinValue', {
                            statusMinValue: isActiveValue.minValue,
                        }).orWhere('SubjectCategory.status = :statusMaxValue', { statusMaxValue: isActiveValue.maxValue });
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
