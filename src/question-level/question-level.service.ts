import { SortOrder } from './../core/interface/repositories.interface';
import { FilterService } from './../core/providers/filter/filter.service';
import { QuestionLevel } from './../core/models';
import { QuestionLevelRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';

@Injectable()
export class QuestionLevelService {
    constructor(private readonly questionLevelRepository: QuestionLevelRepository, private readonly filterService: FilterService) {}

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
        let questionLevels, count;
        const isActiveValue = this.filterService.getMinMaxValue(status);
        try {
            questionLevels = await this.questionLevelRepository
                .createQueryBuilder('question_level')
                .where('question_level.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('question_level.isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('question_level.isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .orderBy(`question_level.${orderBy}`, order)
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = await this.questionLevelRepository
                .createQueryBuilder('question_level')
                .where('question_level.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('question_level.isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('question_level.isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
        return { data: questionLevels, count };
    }
}
