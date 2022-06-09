import { LessonQuiz } from './../core/models';
import { LessonQuizRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonQuizService {
    constructor(private readonly lessonQuizRepository: LessonQuizRepository) {}

    async saveLessonQuiz(lessonQuiz: LessonQuiz): Promise<LessonQuiz> {
        return await this.lessonQuizRepository.save(lessonQuiz);
    }
}
