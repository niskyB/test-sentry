import { PricePackageRepository } from './../core/repositories/pricePackage.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PricePackageService {
    constructor(private readonly pricePackageRepository: PricePackageRepository) {}
}
