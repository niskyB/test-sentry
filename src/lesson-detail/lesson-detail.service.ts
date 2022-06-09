import { LessonDetail } from './../core/models';
import { LessonDetailRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonDetailService {
    constructor(private readonly lessonDetailRepository: LessonDetailRepository) {}

    async saveLessonDetail(lessonDetail: LessonDetail): Promise<LessonDetail> {
        return await this.lessonDetailRepository.save(lessonDetail);
    }
}
