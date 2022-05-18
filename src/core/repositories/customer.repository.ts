import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';
import { Customer } from '../models';

@EntityRepository(Customer)
export class CustomerRepository extends RepositoryService<Customer> {}
