import { Sale } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(Sale)
export class SaleRepository extends RepositoryService<Sale> {}
