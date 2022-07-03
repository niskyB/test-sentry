import { SortOrder } from './../core/interface';
import { FilterService } from './../core/providers/filter/filter.service';
import { QuizType } from '../core/models';
import { Injectable } from '@nestjs/common';
import { QuizTypeRepository } from '../core/repositories';
import { Brackets } from 'typeorm';

@Injectable()
export class QuizTypeService {
    constructor(private readonly quizTypeRepository: QuizTypeRepository, private readonly filterService: FilterService) {}

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
        let quizTypes, count;
        const isActiveValue = this.filterService.getMinMaxValue(status);
        try {
            quizTypes = await this.quizTypeRepository
                .createQueryBuilder('quiz_type')
                .where('quiz_type.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('quiz_type.isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('quiz_type.isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .orderBy(`quiz_type.${orderBy}`, order)
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = await this.quizTypeRepository
                .createQueryBuilder('quiz_type')
                .where('quiz_type.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('quiz_type.isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('quiz_type.isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
        return { data: quizTypes, count };
    }
}
