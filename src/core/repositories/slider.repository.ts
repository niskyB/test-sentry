import { Slider } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(Slider)
export class SliderRepository extends RepositoryService<Slider> {
    public async findOneByField(field: keyof Slider, value: any): Promise<Slider> {
        return await this.createQueryBuilder('slider').where(`slider.${field.toString()} = :value`, { value }).leftJoinAndSelect('slider.marketing', 'marketing').getOne();
    }
}
