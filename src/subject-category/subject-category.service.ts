import { SubjectCategory } from './../core/models';
import { SubjectCategoryRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubjectCategoryService {
    constructor(private readonly subjectCategoryRepository: SubjectCategoryRepository) {}

    async getSubjectCategoryByField(field: keyof SubjectCategory, value: any): Promise<SubjectCategory> {
        return await this.subjectCategoryRepository.findOneByField(field, value);
    }
}
