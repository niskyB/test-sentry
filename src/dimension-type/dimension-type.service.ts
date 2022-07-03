import { SortOrder } from './../core/interface';
import { DimensionType } from './../core/models';
import { DimensionTypeRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DimensionTypeService {
    constructor(private readonly dimensionTypeRepository: DimensionTypeRepository) {}

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
        return await this.dimensionTypeRepository.filterSetting(status, value, order, orderBy, currentPage, pageSize);
    }
}
