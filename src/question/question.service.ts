import { Question } from './../core/models';
import { QuestionRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

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

    async getAllQuestions(): Promise<{ data: Question[]; count: number }> {
        const questions = await this.questionRepository.createQueryBuilder('question').getMany();
        const count = await this.questionRepository.createQueryBuilder('question').getCount();
        return { data: questions, count };
    }

    async getQuestionsByUserId(id: string): Promise<{ data: Question[]; count: number }> {
        const questions = await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.lesson', 'lesson')
            .leftJoinAndSelect('lesson.subject', 'subject')
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .where('user.id = (:id)', { id })
            .getMany();
        const count = await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.lesson', 'lesson')
            .leftJoinAndSelect('lesson.subject', 'subject')
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .where('user.id = (:id)', { id })
            .getCount();
        return { data: questions, count };
    }
}
