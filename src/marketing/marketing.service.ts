import { Marketing } from './../core/models';
import { MarketingRepository } from './../core/repositories';
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

    async saveMarketing(marketing: Marketing): Promise<Marketing> {
        return await this.marketingRepository.save(marketing);
    }
}
