import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../core/repositories';

@Injectable()
export class TransactionService {
    constructor(private readonly transactionRepository: TransactionRepository) {}
}
