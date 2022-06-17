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
        try {
            const dimensions = await this.dimensionRepository
                .createQueryBuilder('dimension')
                .leftJoinAndSelect('dimension.type', 'type')
                .leftJoinAndSelect('dimension.subject', 'subject')
                .where('subject.id = (:id)', { id })
                .leftJoinAndSelect('subject.assignTo', 'assignTo')
                .leftJoinAndSelect('assignTo.user', 'user')
                .skip(0)
                .take(200)
                .getMany();
            const count = await this.dimensionRepository.createQueryBuilder('dimension').leftJoinAndSelect('dimension.subject', 'subject').andWhere('subject.id = (:id)', { id }).getCount();
            return { data: dimensions, count };
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
    }
}
