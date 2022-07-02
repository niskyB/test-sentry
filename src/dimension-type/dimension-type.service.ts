import { SortOrder } from './../core/interface/repositories.interface';
import { FilterService } from './../core/providers/filter/filter.service';
import { DimensionType } from './../core/models';
import { DimensionTypeRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';

@Injectable()
export class DimensionTypeService {
    constructor(private readonly dimensionTypeRepository: DimensionTypeRepository, private readonly filterService: FilterService) {}

    async saveDimensionType(dimensionType: DimensionType): Promise<DimensionType> {
        return await this.dimensionTypeRepository.save(dimensionType);
    }

    async getDimensionTypeByField(field: keyof DimensionType, value: any): Promise<DimensionType> {
        return await this.dimensionTypeRepository.findOneByField(field, value);
    }

    async getAllDimensionTypes(): Promise<DimensionType[]> {
        return await this.dimensionTypeRepository.createQueryBuilder('DimensionType').getMany();
    }

    async filterDimensionTypes(status: boolean, value: string, order: SortOrder, orderBy: string, currentPage: number, pageSize: number): Promise<{ data: DimensionType[]; count: number }> {
        let dimensionTypes, count;
        const isActiveValue = this.filterService.getMinMaxValue(status);
        try {
            dimensionTypes = await this.dimensionTypeRepository
                .createQueryBuilder('DimensionType')
                .where('DimensionType.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('DimensionType.isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('DimensionType.isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .orderBy(`DimensionType.${orderBy}`, order)
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = this.dimensionTypeRepository
                .createQueryBuilder('DimensionType')
                .where('DimensionType.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('DimensionType.status = :statusMinValue', {
                            statusMinValue: isActiveValue.minValue,
                        }).orWhere('DimensionType.status = :statusMaxValue', { statusMaxValue: isActiveValue.maxValue });
                    }),
                )
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
        return { data: dimensionTypes, count };
    }
}
