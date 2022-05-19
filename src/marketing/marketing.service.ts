import { Marketing } from './../core/models/marketing';
import { MarketingRepository } from './../core/repositories/marketing.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MarketingService {
    constructor(private readonly marketingRepository: MarketingRepository) {}

    async getMarketingByUserId(userId: string): Promise<Marketing> {
        try {
            const marketing = await this.marketingRepository
                .createQueryBuilder('marketing')
                .leftJoinAndSelect('marketing.user', 'user')
                .andWhere('user.id LIKE (:userId)', { userId: `%${userId}%` })
                .getOne();
            return marketing;
        } catch (err) {
            return new Marketing();
        }
    }
}
