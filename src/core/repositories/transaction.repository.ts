import { EntityRepository } from 'typeorm';
import { Transaction } from '../models';
import { RepositoryService } from '../providers';

@EntityRepository(Transaction)
export class TransactionRepository extends RepositoryService<Transaction> {}
