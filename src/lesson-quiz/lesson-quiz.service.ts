import { LessonQuiz } from './../core/models';
import { LessonQuizRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonQuizService {
    constructor(private readonly lessonQuizRepository: LessonQuizRepository) {}

    async saveLessonQuiz(lessonQuiz: LessonQuiz): Promise<LessonQuiz> {
        return await this.lessonQuizRepository.save(lessonQuiz);
    }

    async getLessonQuizByLessonId(id: string): Promise<LessonQuiz> {
        return await this.lessonQuizRepository
            .createQueryBuilder('lesson_quiz')
            .leftJoin('lesson_quiz.lesson', 'lesson')
            .leftJoinAndSelect('lesson_quiz.quizzes', 'quizzes')
            .leftJoinAndSelect('quizzes.type', 'type')
            .leftJoinAndSelect('quizzes.level', 'level')
            .where('lesson.id = (:id)', { id })
            .getOne();
    }
}
