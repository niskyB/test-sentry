import { LessonDetail } from './../core/models';
import { LessonDetailRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonDetailService {
    constructor(private readonly lessonDetailRepository: LessonDetailRepository) {}

    async saveLessonDetail(lessonDetail: LessonDetail): Promise<LessonDetail> {
        return await this.lessonDetailRepository.save(lessonDetail);
    }

    async getLessonDetailByLessonId(id: string): Promise<LessonDetail> {
        return await this.lessonDetailRepository.createQueryBuilder('lesson_detail').leftJoin('lesson_detail.lesson', 'lesson').where('lesson.id = (:id)', { id }).getOne();
    }
}
