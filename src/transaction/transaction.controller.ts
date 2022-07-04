import { CommonGuard } from './../auth/guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';

@ApiTags('transaction')
@ApiBearerAuth()
@UseGuards(CommonGuard)
@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}
}
