import { Customer } from './../core/models';
import { CustomerRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerService {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async saveCustomer(customer: Customer): Promise<Customer> {
        return await this.customerRepository.save(customer);
    }
}
