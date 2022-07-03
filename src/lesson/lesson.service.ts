import { Lesson } from './../core/models';
import { LessonRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { FilterService } from '../core/providers';
import { Brackets } from 'typeorm';

@Injectable()
export class LessonService {
    constructor(private readonly lessonRepository: LessonRepository, private readonly filterService: FilterService) {}

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

    async getLessonsBySubjectId(id: string, name: string, type: string, createdAt: string, updatedAt: string, isActive: boolean): Promise<{ data: Lesson[]; count: number }> {
        const activeValue = this.filterService.getMinMaxValue(isActive);
        let lessons, count;
        try {
            lessons = await this.lessonRepository
                .createQueryBuilder('Lesson')
                .leftJoinAndSelect('Lesson.subject', 'subject')
                .where('subject.id = (:id)', { id })
                .andWhere('Lesson.name LIKE (:name)', { name: `%${name}%` })
                .leftJoinAndSelect('subject.assignTo', 'assignTo')
                .leftJoinAndSelect('assignTo.user', 'user')
                .leftJoinAndSelect('Lesson.type', 'type')
                .andWhere('type.description LIKE (:type)', { type: `%${type}%` })
                .andWhere('Lesson.createdAt >= (:createdAt)', { createdAt })
                .andWhere('Lesson.updatedAt >= (:updatedAt)', { updatedAt })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('Lesson.isActive = :activeMinValue', {
                            activeMinValue: activeValue.minValue,
                        }).orWhere('Lesson.isActive = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                    }),
                )
                .getMany();

            count = await this.lessonRepository
                .createQueryBuilder('Lesson')
                .leftJoinAndSelect('Lesson.subject', 'subject')
                .where('subject.id = (:id)', { id })
                .andWhere('Lesson.name LIKE (:name)', { name: `%${name}%` })
                .leftJoinAndSelect('subject.assignTo', 'assignTo')
                .leftJoinAndSelect('assignTo.user', 'user')
                .leftJoinAndSelect('Lesson.type', 'type')
                .andWhere('type.description LIKE (:type)', { type: `%${type}%` })
                .andWhere('Lesson.createdAt >= (:createdAt)', { createdAt })
                .andWhere('Lesson.updatedAt >= (:updatedAt)', { updatedAt })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('Lesson.isActive = :activeMinValue', {
                            activeMinValue: activeValue.minValue,
                        }).orWhere('Lesson.isActive = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                    }),
                )
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
        return { data: lessons, count };
    }

    async deleteLesson(lesson: Lesson) {
        return await this.lessonRepository.delete(lesson);
    }
}
