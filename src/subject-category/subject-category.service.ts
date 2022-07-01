import { SubjectCategory } from './../core/models';
import { SubjectCategoryRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubjectCategoryService {
    constructor(private readonly subjectCategoryRepository: SubjectCategoryRepository) {}

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
}
