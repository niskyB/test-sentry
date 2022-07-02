import { FilterService } from './../core/providers/filter/filter.service';
import { SortOrder } from './../core/interface';
import { LessonType } from './../core/models';
import { LessonTypeRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';

@Injectable()
export class LessonTypeService {
    constructor(private readonly lessonTypeRepository: LessonTypeRepository, private readonly filterService: FilterService) {}

    async saveLessonType(lessonType: LessonType): Promise<LessonType> {
        return await this.lessonTypeRepository.save(lessonType);
    }

    async getLessonTypeByField(field: keyof LessonType, value: any): Promise<LessonType> {
        return await this.lessonTypeRepository.findOneByField(field, value);
    }

    async getAllLessonTypes(): Promise<LessonType[]> {
        return await this.lessonTypeRepository.createQueryBuilder('LessonType').getMany();
    }

    async filterRoles(status: boolean, value: string, order: SortOrder, orderBy: string, currentPage: number, pageSize: number): Promise<{ data: LessonType[]; count: number }> {
        let lessonTypes, count;
        const isActiveValue = this.filterService.getMinMaxValue(status);
        try {
            lessonTypes = await this.lessonTypeRepository
                .createQueryBuilder('LessonType')
                .where('LessonType.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('LessonType.isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('LessonType.isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .orderBy(`LessonType.${orderBy}`, order)
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = this.lessonTypeRepository
                .createQueryBuilder('LessonType')
                .where('LessonType.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('LessonType.status = :statusMinValue', {
                            statusMinValue: isActiveValue.minValue,
                        }).orWhere('LessonType.status = :statusMaxValue', { statusMaxValue: isActiveValue.maxValue });
                    }),
                )
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
        return { data: lessonTypes, count };
    }
}
