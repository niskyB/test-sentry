import { PricePackage } from './../core/models';
import { PricePackageRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PricePackageService {
    constructor(private readonly pricePackageRepository: PricePackageRepository) {}

    async getPricePackageByField(field: keyof PricePackage, value: any): Promise<PricePackage> {
        return await this.pricePackageRepository.findOneByField(field, value);
    }

    async savePricePackage(pricePackage: PricePackage): Promise<PricePackage> {
        return await this.pricePackageRepository.save(pricePackage);
    }
}
