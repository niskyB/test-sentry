import { SaleRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { Sale } from '../core/models';

@Injectable()
export class SaleService {
    constructor(private readonly saleRepository: SaleRepository) {}

    async saveSale(sale: Sale): Promise<Sale> {
        return await this.saleRepository.save(sale);
    }

    async getSaleByUserId(userId: string): Promise<Sale> {
        try {
            const sale = await this.saleRepository.createQueryBuilder('sale').leftJoinAndSelect('sale.user', 'user').andWhere('user.id = (:userId)', { userId }).getOne();
            return sale;
        } catch (err) {
            return new Sale();
        }
    }
}
