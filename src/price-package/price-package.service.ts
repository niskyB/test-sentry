import { PricePackage } from './../core/models';
import { PricePackageRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PricePackageService {
    constructor(private readonly pricePackageRepository: PricePackageRepository) {}

    async getPricePackageByField(field: keyof PricePackage, value: any): Promise<PricePackage> {
        return await this.pricePackageRepository
            .createQueryBuilder('price_package')
            .where(`price_package.${field.toString()} = :value`, { value })
            .leftJoinAndSelect('price_package.subject', 'subject')
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .getOne();
    }

    async savePricePackage(pricePackage: PricePackage): Promise<PricePackage> {
        return await this.pricePackageRepository.save(pricePackage);
    }

    async getPricePackagesBySubjectId(id: string): Promise<PricePackage[]> {
        return await this.pricePackageRepository.createQueryBuilder('PricePackage').leftJoinAndSelect('PricePackage.subject', 'subject').where('subject.id = (:id)', { id }).getMany();
    }
}
