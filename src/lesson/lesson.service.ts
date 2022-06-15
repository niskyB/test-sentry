import { Lesson } from './../core/models';
import { LessonRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonService {
    constructor(private readonly lessonRepository: LessonRepository) {}

    async saveLesson(lesson: Lesson): Promise<Lesson> {
        return await this.lessonRepository.save(lesson);
    }

    async getLessonByField(field: keyof Lesson, value: any): Promise<Lesson> {
        return await this.lessonRepository
            .createQueryBuilder('lesson')
            .where(`lesson.${field.toString()} = :value`, { value })
            .leftJoinAndSelect('lesson.subject', 'subject')
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .leftJoinAndSelect('lesson.type', 'type')
            .getOne();
    }

    async getLessonsBySubjectId(id: string): Promise<Lesson[]> {
        return await this.lessonRepository
            .createQueryBuilder('Lesson')
            .leftJoinAndSelect('Lesson.subject', 'subject')
            .where('subject.id = (:id)', { id })
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .leftJoinAndSelect('Lesson.type', 'type')
            .getMany();
    }

    async deleteLesson(lesson: Lesson) {
        return await this.lessonRepository.delete(lesson);
    }
}
