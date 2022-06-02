import { PricePackage } from './../core/models';
import { PricePackageRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PricePackageService {
    constructor(private readonly pricePackageRepository: PricePackageRepository) {}

    async savePricePackage(pricePackage: PricePackage): Promise<PricePackage> {
        return await this.pricePackageRepository.save(pricePackage);
    }
}
