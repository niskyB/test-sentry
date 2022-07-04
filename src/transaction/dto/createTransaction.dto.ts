import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { transactionValidateSchema } from '../../core/models';

export class CreateTransactionDTO {
    @ApiProperty({ description: 'Amount', example: '50000' })
    amount: number;
}

export const vCreateTransactionDTO = joi.object<CreateTransactionDTO>({
    amount: transactionValidateSchema.amount,
});
