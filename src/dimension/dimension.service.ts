import { Dimension } from './../core/models';
import { DimensionRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DimensionService {
    constructor(private readonly dimensionRepository: DimensionRepository) {}

    async saveDimension(dimension: Dimension): Promise<Dimension> {
        return await this.dimensionRepository.save(dimension);
    }

    async getDimensionByField(field: keyof Dimension, value: any): Promise<Dimension> {
        return await this.dimensionRepository.findOneByField(field, value);
    }
}
