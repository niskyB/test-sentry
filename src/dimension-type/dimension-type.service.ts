import { DimensionType } from './../core/models';
import { DimensionTypeRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DimensionTypeService {
    constructor(private readonly dimensionTypeRepository: DimensionTypeRepository) {}

    async getDimensionTypeByField(field: keyof DimensionType, value: any): Promise<DimensionType> {
        return await this.dimensionTypeRepository.findOneByField(field, value);
    }

    async getAllDimensionTypes(): Promise<DimensionType[]> {
        return await this.dimensionTypeRepository.createQueryBuilder('DimensionType').getMany();
    }
}
