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
}
