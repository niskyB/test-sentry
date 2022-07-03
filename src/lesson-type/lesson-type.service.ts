import { SortOrder } from './../core/interface';
import { LessonType } from './../core/models';
import { LessonTypeRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonTypeService {
    constructor(private readonly lessonTypeRepository: LessonTypeRepository) {}

    async saveLessonType(lessonType: LessonType): Promise<LessonType> {
        return await this.lessonTypeRepository.save(lessonType);
    }

    async getLessonTypeByField(field: keyof LessonType, value: any): Promise<LessonType> {
        return await this.lessonTypeRepository.findOneByField(field, value);
    }

    async getAllLessonTypes(): Promise<LessonType[]> {
        return await this.lessonTypeRepository.createQueryBuilder('LessonType').getMany();
    }

    async filterLessonTypes(status: boolean, value: string, order: SortOrder, orderBy: string, currentPage: number, pageSize: number): Promise<{ data: LessonType[]; count: number }> {
        return await this.lessonTypeRepository.filterSetting(status, value, order, orderBy, currentPage, pageSize);
    }
}
