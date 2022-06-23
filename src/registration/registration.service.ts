import { SortOrder } from './../core/interface';
import { RegistrationStatus } from './../core/models/registration';
import { Injectable } from '@nestjs/common';
import { Registration } from '../core/models';
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

    async filterRegistrations(
        subject: string,
        validFrom: string,
        validTo: string,
        status: RegistrationStatus,
        email: string,
        currentPage: number,
        pageSize: number,
        order: SortOrder,
        orderBy: keyof Registration,
    ): Promise<{ data: Registration[]; count: number }> {
        let registrations, count;
        try {
            registrations = await this.registrationRepository
                .createQueryBuilder('registration')
                .leftJoinAndSelect('registration.pricePackage', 'pricePackage')
                .leftJoinAndSelect('pricePackage.subject', 'subject')
                .where('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
                .andWhere('registration.validFrom >= (:validFrom)', { validFrom })
                .andWhere('registration.validTo >= (:validTo)', { validTo })
                .andWhere('registration.status LIKE (:status)', { status: `%${status}%` })
                .leftJoinAndSelect('registration.customer', 'customer')
                .leftJoinAndSelect('customer.user', 'user')
                .andWhere('user.email LIKE (:email)', { email: `%${email}%` })
                .orderBy(`user.${orderBy}`, order)
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = await this.registrationRepository
                .createQueryBuilder('registration')
                .leftJoinAndSelect('registration.pricePackage', 'pricePackage')
                .leftJoinAndSelect('pricePackage.subject', 'subject')
                .where('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
                .andWhere('registration.validFrom >= (:validFrom)', { validFrom })
                .andWhere('registration.validTo >= (:validTo)', { validTo })
                .andWhere('registration.status LIKE (:status)', { status: `%${status}%` })
                .leftJoinAndSelect('registration.customer', 'customer')
                .leftJoinAndSelect('customer.user', 'user')
                .andWhere('user.email LIKE (:email)', { email: `%${email}%` })
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }

        return { data: registrations, count };
    }
}
