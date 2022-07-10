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
        return await this.dimensionRepository
            .createQueryBuilder('Dimension')
            .where(`Dimension.${field.toString()} = :value`, { value })
            .leftJoinAndSelect('Dimension.type', 'type')
            .leftJoinAndSelect('Dimension.subject', 'subject')
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .getOne();
    }

    async getDimensionsBySubjectId(id: string): Promise<{ data: Dimension[]; count: number }> {
        const query = this.dimensionRepository.createQueryBuilder('dimension').leftJoinAndSelect('dimension.subject', 'subject').where('subject.id = (:id)', { id });
        try {
            const dimensions = await query.leftJoinAndSelect('dimension.type', 'type').leftJoinAndSelect('subject.assignTo', 'assignTo').leftJoinAndSelect('assignTo.user', 'user').getMany();
            const count = await query.getCount();
            return { data: dimensions, count };
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
    }
}
