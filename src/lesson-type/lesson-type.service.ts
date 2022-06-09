import { LessonType } from './../core/models/lesson-type';
import { LessonTypeRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonTypeService {
    constructor(private readonly lessonTypeRepository: LessonTypeRepository) {}

    async getLessonTypeByField(field: keyof LessonType, value: any): Promise<LessonType> {
        return await this.lessonTypeRepository.findOneByField(field, value);
    }

    async getAllLessonTypes(): Promise<LessonType[]> {
        return await this.lessonTypeRepository.createQueryBuilder('LessonType').getMany();
    }
}
