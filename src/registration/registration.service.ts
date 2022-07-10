import { StatusCodes } from 'http-status-codes';
import { FilterService } from './../core/providers';
import { ResponseMessage, SortOrder } from './../core/interface';
import { HttpException, Injectable } from '@nestjs/common';
import { Registration, RegistrationStatus } from '../core/models';
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

    async getCountByDayAndSubject(day: string, subjectCategory: string): Promise<{ data: Registration[]; date: string }> {
        let data;
        try {
            data = await this.registrationRepository
                .createQueryBuilder('registration')
                .where('registration.registrationTime LIKE (:day)', { day: `%${day}%` })
                .andWhere('registration.status LIKE (:status)', { status: 'paid' })
                .leftJoinAndSelect('registration.pricePackage', 'pricePackage')
                .leftJoinAndSelect('pricePackage.subject', 'subject')
                .leftJoinAndSelect('subject.category', 'category')
                .leftJoinAndSelect('registration.customer', 'customer')
                .leftJoinAndSelect('customer.user', 'user')
                .andWhere('category.id LIKE (:id)', { id: `%${subjectCategory}%` })
                .getMany();
        } catch (err) {
            console.log(err);
            return { data, date: day };
        }
        return { data, date: day };
    }

    async getPaidRegistrationByDay(day: string): Promise<Registration[]> {
        return await this.registrationRepository
            .createQueryBuilder('registration')
            .where('registration.status = (:status)', { status: RegistrationStatus.PAID })
            .andWhere('registration.validTo <= (:day)', { day })
            .getMany();
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
        let query = this.registrationRepository
            .createQueryBuilder('registration')
            .leftJoinAndSelect('registration.pricePackage', 'pricePackage')
            .leftJoinAndSelect('pricePackage.subject', 'subject')
            .where('subject.name LIKE (:subject)', { subject: `%${subject}%` })
            .andWhere('registration.registrationTime >= (:validFrom)', { validFrom })
            .andWhere('registration.registrationTime <= (:validTo)', { validTo })
            .andWhere('registration.status LIKE (:status)', { status: `%${status}%` })
            .leftJoinAndSelect('registration.customer', 'customer')
            .leftJoinAndSelect('customer.user', 'user')
            .andWhere('user.email LIKE (:email)', { email: `%${email}%` });
        try {
            query = query.leftJoinAndSelect('subject.category', 'category').leftJoinAndSelect('registration.sale', 'sale').leftJoinAndSelect('sale.user', 'saleUser');
            switch (orderBy) {
                case 'subject':
                    query = query.orderBy(`subject.id`, order);
                    break;
                case 'email':
                    query = query.orderBy(`user.email`, order);
                    break;
                case 'package':
                    query = query.orderBy(`pricePackage.id`, order);
                    break;
                default:
                    query = query.orderBy(`registration.${orderBy}`, order);
            }
            registrations = await query
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = await query.getCount();
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
        const query = this.registrationRepository
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
            .andWhere('user.id = (:userId)', { userId });
        try {
            registrations = await query
                .leftJoinAndSelect('registration.sale', 'sale')
                .leftJoinAndSelect('sale.user', 'saleUser')
                .orderBy(`subject.updatedAt`, order)
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = await query.getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }

        return { data: registrations, count };
    }

    async checkUserAccess(subject: string, email: string) {
        const registrations = await this.getExistedRegistration(subject, email);

        if (!registrations || registrations.length === 0) throw new HttpException({ errorMessage: ResponseMessage.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED);
        const validRegistration = registrations.filter((item) => item.status === RegistrationStatus.PAID);
        if (!validRegistration || validRegistration.length === 0) throw new HttpException({ errorMessage: ResponseMessage.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED);
    }
}
