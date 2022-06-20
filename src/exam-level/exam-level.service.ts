import { Injectable } from '@nestjs/common';
import { ExamLevel } from '../core/models';
import { ExamLevelRepository } from '../core/repositories';

@Injectable()
export class ExamLevelService {
    constructor(private readonly examLevelRepository: ExamLevelRepository) {}

    async getAllExamLevel(): Promise<ExamLevel[]> {
        return this.examLevelRepository.createQueryBuilder('exam_level').getMany();
    }

    async getExamLevelByField(field: keyof ExamLevel, value: any): Promise<ExamLevel> {
        return this.examLevelRepository.findOneByField(field, value);
    }
}
