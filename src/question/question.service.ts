import { Question } from './../core/models';
import { QuestionRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';

@Injectable()
export class QuestionService {
    constructor(private readonly questionRepository: QuestionRepository) {}

    async saveQuestion(question: Question): Promise<Question> {
        return await this.questionRepository.save(question);
    }

    async getQuestionByField(field: keyof Question, value: any): Promise<Question> {
        return await this.questionRepository.findOneByField(field, value);
    }

    async getQuestionBySubjectId(id: string): Promise<Question[]> {
        return await this.questionRepository
            .createQueryBuilder('Question')
            .leftJoinAndSelect('Question.dimensions', 'dimensions')
            .leftJoinAndSelect('dimensions.subject', 'subject')
            .andWhere('subject.id LIKE (:id)', { id: `%${id}%` })
            .getMany();
    }

    getMinMaxValue(value: boolean) {
        if (value === false)
            return {
                minValue: 0,
                maxValue: 0,
            };
        if (value === true)
            return {
                minValue: 1,
                maxValue: 1,
            };
        if (value === null)
            return {
                minValue: 0,
                maxValue: 1,
            };
    }

    async getQuestionsForAdmin(
        subject: string,
        lesson: string,
        dimension: string,
        level: string,
        content: string,
        isActive: boolean,
        currentPage: number,
        pageSize: number,
    ): Promise<{ data: Question[]; count: number }> {
        const activeValue = this.getMinMaxValue(isActive);
        const questions = await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.lesson', 'lesson')
            .where('lesson.id LIKE (:lessonId)', { lessonId: `%${lesson}%` })
            .leftJoinAndSelect('lesson.subject', 'subject')
            .andWhere('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
            .leftJoinAndSelect('question.dimensions', 'dimensions')
            .andWhere('dimensions.id LIKE (:dimensionId)', { dimensionId: `%${dimension}%` })
            .leftJoinAndSelect('question.questionLevel', 'questionLevel')
            .andWhere('questionLevel.id LIKE (:levelId)', { levelId: `%${level}%` })
            .andWhere('question.content LIKE (:content)', { content: `%${content}%` })
            .andWhere(
                new Brackets((qb) => {
                    qb.where('question.isActive = :activeMinValue', {
                        activeMinValue: activeValue.minValue,
                    }).orWhere('question.isActive = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                }),
            )
            .skip(currentPage * pageSize)
            .take(pageSize)
            .getMany();
        const count = await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.lesson', 'lesson')
            .where('lesson.id LIKE (:lessonId)', { lessonId: `%${lesson}%` })
            .leftJoinAndSelect('lesson.subject', 'subject')
            .andWhere('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
            .leftJoinAndSelect('question.dimensions', 'dimensions')
            .andWhere('dimensions.id LIKE (:dimensionId)', { dimensionId: `%${dimension}%` })
            .leftJoinAndSelect('question.questionLevel', 'questionLevel')
            .andWhere('questionLevel.id LIKE (:levelId)', { levelId: `%${level}%` })
            .andWhere('question.content LIKE (:content)', { content: `%${content}%` })
            .andWhere(
                new Brackets((qb) => {
                    qb.where('question.isActive = :activeMinValue', {
                        activeMinValue: activeValue.minValue,
                    }).orWhere('question.isActive = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                }),
            )
            .getCount();
        return { data: questions, count };
    }

    async getQuestionsByUserId(
        id: string,
        subject: string,
        lesson: string,
        dimension: string,
        level: string,
        content: string,
        isActive: boolean,
        currentPage: number,
        pageSize: number,
    ): Promise<{ data: Question[]; count: number }> {
        const activeValue = this.getMinMaxValue(isActive);
        const questions = await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.lesson', 'lesson')
            .where('lesson.id LIKE (:lessonId)', { lessonId: `%${lesson}%` })
            .leftJoinAndSelect('lesson.subject', 'subject')
            .andWhere('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .andWhere('user.id = (:id)', { id })
            .leftJoinAndSelect('question.dimensions', 'dimensions')
            .andWhere('dimensions.id LIKE (:dimensionId)', { dimensionId: `%${dimension}%` })
            .leftJoinAndSelect('question.questionLevel', 'questionLevel')
            .andWhere('questionLevel.id LIKE (:levelId)', { levelId: `%${level}%` })
            .andWhere('question.content LIKE (:content)', { content: `%${content}%` })
            .andWhere(
                new Brackets((qb) => {
                    qb.where('question.isActive = :activeMinValue', {
                        activeMinValue: activeValue.minValue,
                    }).orWhere('question.isActive = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                }),
            )
            .skip(currentPage * pageSize)
            .take(pageSize)
            .getMany();
        const count = await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.lesson', 'lesson')
            .where('lesson.id LIKE (:lessonId)', { lessonId: `%${lesson}%` })
            .leftJoinAndSelect('lesson.subject', 'subject')
            .andWhere('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .andWhere('user.id = (:id)', { id })
            .leftJoinAndSelect('question.dimensions', 'dimensions')
            .andWhere('dimensions.id LIKE (:dimensionId)', { dimensionId: `%${dimension}%` })
            .leftJoinAndSelect('question.questionLevel', 'questionLevel')
            .andWhere('questionLevel.id LIKE (:levelId)', { levelId: `%${level}%` })
            .andWhere('question.content LIKE (:content)', { content: `%${content}%` })
            .andWhere(
                new Brackets((qb) => {
                    qb.where('question.isActive = :activeMinValue', {
                        activeMinValue: activeValue.minValue,
                    }).orWhere('question.isActive = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                }),
            )
            .getCount();
        return { data: questions, count };
    }
}
