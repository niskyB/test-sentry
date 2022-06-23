import { Injectable } from '@nestjs/common';
import { Registration } from 'src/core/models';
import { RegistrationRepository } from '../core/repositories';

@Injectable()
export class RegistrationService {
    constructor(private readonly registrationRepository: RegistrationRepository) {}

    async saveRegistration(registration: Registration): Promise<Registration> {
        return await this.registrationRepository.save(registration);
    }

    async getRegistrationByField(field: keyof Registration, value: any): Promise<Registration> {
        return await this.registrationRepository
            .createQueryBuilder('registration')
            .where(`registration.${field} = (:value)`, { value })
            .leftJoinAndSelect('registration.customer', 'customer')
            .leftJoinAndSelect('customer.user', 'user')
            .leftJoinAndSelect('registration.pricePackage', 'pricePackage')
            .getOne();
    }
}
