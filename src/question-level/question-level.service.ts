import { SortOrder } from './../core/interface';
import { QuestionLevel } from './../core/models';
import { QuestionLevelRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionLevelService {
    constructor(private readonly questionLevelRepository: QuestionLevelRepository) {}

    async getOneByField(field: keyof QuestionLevel, value: any): Promise<QuestionLevel> {
        return await this.questionLevelRepository.findOneByField(field, value);
    }

    async getAllQuestionLevel(): Promise<QuestionLevel[]> {
        return await this.questionLevelRepository.createQueryBuilder('question_level').getMany();
    }

    async saveQuestionLevel(questionLevel: QuestionLevel): Promise<QuestionLevel> {
        return await this.questionLevelRepository.save(questionLevel);
    }

    async filterQuestionLevels(status: boolean, value: string, order: SortOrder, orderBy: string, currentPage: number, pageSize: number): Promise<{ data: QuestionLevel[]; count: number }> {
        return await this.questionLevelRepository.filterSetting(status, value, order, orderBy, currentPage, pageSize);
    }
}
