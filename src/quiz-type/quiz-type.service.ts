import { QuizType } from '../core/models';
import { Injectable } from '@nestjs/common';
import { QuizTypeRepository } from '../core/repositories';

@Injectable()
export class QuizTypeService {
    constructor(private readonly quizTypeRepository: QuizTypeRepository) {}

    async getAllQuizTypes(): Promise<QuizType[]> {
        return await this.quizTypeRepository.createQueryBuilder('quiz_type').getMany();
    }

    async getQuizTypeByField(field: keyof QuizType, value: any): Promise<QuizType> {
        return await this.quizTypeRepository.findOneByField(field, value);
    }
}
