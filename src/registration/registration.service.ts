import { FilterService } from './../core/providers/filter/filter.service';
import { SortOrder } from './../core/interface';
import { Injectable } from '@nestjs/common';
import { Registration } from '../core/models';
import { RegistrationRepository } from '../core/repositories';
import { Brackets } from 'typeorm';

@Injectable()
export class RegistrationService {
    constructor(private readonly registrationRepository: RegistrationRepository, private readonly filterService: FilterService) {}

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
            .leftJoinAndSelect('pricePackage.subject', 'subject')
            .leftJoinAndSelect('subject.category', 'category')
            .leftJoinAndSelect('registration.sale', 'sale')
            .leftJoinAndSelect('sale.user', 'saleUser')
            .getOne();
    }

    async getExistedRegistration(subject: string, email: string): Promise<Registration[]> {
        return await this.registrationRepository
            .createQueryBuilder('registration')
            .leftJoinAndSelect('registration.pricePackage', 'pricePackage')
            .leftJoinAndSelect('pricePackage.subject', 'subject')
            .leftJoinAndSelect('subject.category', 'category')
            .where('subject.id LIKE (:subject)', { subject: `%${subject}%` })
            .leftJoinAndSelect('registration.customer', 'customer')
            .leftJoinAndSelect('customer.user', 'user')
            .andWhere('user.email LIKE (:email)', { email: `%${email}%` })
            .getMany();
    }

    async getCountByDay(day: string, status: string): Promise<{ value: number; date: string }> {
        let value;
        try {
            value = await this.registrationRepository
                .createQueryBuilder('registration')
                .where('registration.registrationTime LIKE (:day)', { day: `%${day}%` })
                .andWhere('registration.status LIKE (:status)', { status: `%${status}%` })
                .getCount();
        } catch (err) {
            console.log(err);
            return { value: 0, date: day };
        }
        return { value, date: day };
    }

    async filterRegistrations(
        subject: string,
        validFrom: string,
        validTo: string,
        status: string,
        email: string,
        currentPage: number,
        pageSize: number,
        order: SortOrder,
        orderBy: string,
    ): Promise<{ data: Registration[]; count: number }> {
        let registrations, count;
        let registrationsQuery = this.registrationRepository.createQueryBuilder('registration');
        try {
            registrationsQuery = registrationsQuery
                .leftJoinAndSelect('registration.pricePackage', 'pricePackage')
                .leftJoinAndSelect('pricePackage.subject', 'subject')
                .leftJoinAndSelect('subject.category', 'category')
                .where('subject.name LIKE (:subject)', { subject: `%${subject}%` })
                .andWhere('registration.registrationTime >= (:validFrom)', { validFrom })
                .andWhere('registration.registrationTime <= (:validTo)', { validTo })
                .andWhere('registration.status LIKE (:status)', { status: `%${status}%` })
                .leftJoinAndSelect('registration.customer', 'customer')
                .leftJoinAndSelect('customer.user', 'user')
                .leftJoinAndSelect('registration.sale', 'sale')
                .leftJoinAndSelect('sale.user', 'saleUser')
                .andWhere('user.email LIKE (:email)', { email: `%${email}%` });
            switch (orderBy) {
                case 'subject':
                    registrationsQuery = registrationsQuery.orderBy(`subject.id`, order);
                    break;
                case 'email':
                    registrationsQuery = registrationsQuery.orderBy(`user.email`, order);
                    break;
                case 'package':
                    registrationsQuery = registrationsQuery.orderBy(`pricePackage.id`, order);
                    break;
                default:
                    registrationsQuery = registrationsQuery.orderBy(`registration.${orderBy}`, order);
            }
            registrations = await registrationsQuery
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = await this.registrationRepository
                .createQueryBuilder('registration')
                .leftJoinAndSelect('registration.pricePackage', 'pricePackage')
                .leftJoinAndSelect('pricePackage.subject', 'subject')
                .where('subject.name LIKE (:subject)', { subject: `%${subject}%` })
                .andWhere('registration.registrationTime >= (:validFrom)', { validFrom })
                .andWhere('registration.registrationTime <= (:validTo)', { validTo })
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

    async filterMyRegistrations(
        userId: string,
        name: string,
        category: string,
        isFeature: boolean,
        order: SortOrder,
        status: string,
        currentPage: number,
        pageSize: number,
    ): Promise<{ data: Registration[]; count: number }> {
        let registrations, count;
        const featureValue = this.filterService.getMinMaxValue(isFeature);
        try {
            registrations = await this.registrationRepository
                .createQueryBuilder('registration')
                .leftJoinAndSelect('registration.pricePackage', 'pricePackage')
                .leftJoinAndSelect('pricePackage.subject', 'subject')
                .where('subject.name LIKE (:subjectName)', { subjectName: `%${name}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('subject.isFeature = :featureMinValue', {
                            featureMinValue: featureValue.minValue,
                        }).orWhere('subject.isFeature = :featureMaxValue', { featureMaxValue: featureValue.maxValue });
                    }),
                )
                .andWhere('registration.status LIKE (:status)', { status: `%${status}%` })
                .leftJoinAndSelect('subject.category', 'category')
                .andWhere('category.id LIKE (:categoryId)', { categoryId: `%${category}%` })
                .leftJoinAndSelect('registration.customer', 'customer')
                .leftJoinAndSelect('customer.user', 'user')
                .andWhere('user.id = (:userId)', { userId })
                .leftJoinAndSelect('registration.sale', 'sale')
                .leftJoinAndSelect('sale.user', 'saleUser')
                .orderBy(`subject.updatedAt`, order)
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = await this.registrationRepository
                .createQueryBuilder('registration')
                .leftJoinAndSelect('registration.pricePackage', 'pricePackage')
                .leftJoinAndSelect('pricePackage.subject', 'subject')
                .where('subject.name LIKE (:subjectName)', { subjectName: `%${name}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('subject.isFeature = :featureMinValue', {
                            featureMinValue: featureValue.minValue,
                        }).orWhere('subject.isFeature = :featureMaxValue', { featureMaxValue: featureValue.maxValue });
                    }),
                )
                .andWhere('registration.status LIKE (:status)', { status: `%${status}%` })
                .leftJoinAndSelect('subject.category', 'category')
                .andWhere('category.id LIKE (:categoryId)', { categoryId: `%${category}%` })
                .leftJoinAndSelect('registration.customer', 'customer')
                .leftJoinAndSelect('customer.user', 'user')
                .andWhere('user.id = (:userId)', { userId })
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }

        return { data: registrations, count };
    }
}
