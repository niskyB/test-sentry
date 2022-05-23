import { Expert } from './../core/models';
import { ExpertRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExpertService {
    constructor(private readonly expertRepository: ExpertRepository) {}

    async saveExpert(expert: Expert): Promise<Expert> {
        return await this.expertRepository.save(expert);
    }

    async getExpertByUserId(userId: string): Promise<Expert> {
        try {
            const expert = await this.expertRepository
                .createQueryBuilder('expert')
                .leftJoinAndSelect('expert.user', 'user')
                .andWhere('user.id LIKE (:userId)', { userId: `%${userId}%` })
                .getOne();
            return expert;
        } catch (err) {
            return new Expert();
        }
    }
}
