import { SortOrder } from './../core/interface';
import { QuizType } from '../core/models';
import { Injectable } from '@nestjs/common';
import { QuizTypeRepository } from '../core/repositories';

@Injectable()
export class QuizTypeService {
    constructor(private readonly quizTypeRepository: QuizTypeRepository) {}

    async saveQuizType(quizType: QuizType): Promise<QuizType> {
        return await this.quizTypeRepository.save(quizType);
    }

    async getAllQuizTypes(): Promise<QuizType[]> {
        return await this.quizTypeRepository.createQueryBuilder('quiz_type').getMany();
    }

    async getQuizTypeByField(field: keyof QuizType, value: any): Promise<QuizType> {
        return await this.quizTypeRepository.findOneByField(field, value);
    }

    async filterQuizTypes(status: boolean, value: string, order: SortOrder, orderBy: string, currentPage: number, pageSize: number): Promise<{ data: QuizType[]; count: number }> {
        return await this.quizTypeRepository.filterSetting(status, value, order, orderBy, currentPage, pageSize);
    }
}
