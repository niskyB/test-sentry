import { Customer } from './../core/models';
import { CustomerRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerService {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async saveCustomer(customer: Customer): Promise<Customer> {
        return await this.customerRepository.save(customer);
    }

    async getCustomerByUserId(userId: string): Promise<Customer> {
        try {
            const customer = await this.customerRepository
                .createQueryBuilder('customer')
                .leftJoinAndSelect('customer.user', 'user')
                .andWhere('user.id LIKE (:userId)', { userId: `%${userId}%` })
                .getOne();
            return customer;
        } catch (err) {
            return new Customer();
        }
    }
}
