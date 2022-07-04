import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from './../core/interface';
import { CustomerService } from './../customer/customer.service';
import { Transaction, TransactionStatus } from './../core/models';
import { CommonGuard } from './../auth/guard';
import { Body, Controller, Post, Req, Res, UseGuards, UsePipes, HttpException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { JoiValidatorPipe } from '../core/pipe';
import { CreateTransactionDTO, vCreateTransactionDTO } from './dto';
import { Request, Response } from 'express';
import { MomoCallbackDTO } from '../core/dto';

@ApiTags('transaction')
@ApiBearerAuth()
@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService, private readonly customerService: CustomerService) {}

    @Post('')
    @UseGuards(CommonGuard)
    @UsePipes(new JoiValidatorPipe(vCreateTransactionDTO))
    async cCreateTransaction(@Req() req: Request, @Res() res: Response, @Body() body: CreateTransactionDTO) {
        const customer = await this.customerService.getCustomerByUserId(req.user.id);
        if (!customer) throw new HttpException({ errorMessage: ResponseMessage.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED);

        let transaction = new Transaction();
        transaction.amount = body.amount;
        transaction.customer = customer;
        transaction = await this.transactionService.saveTransaction(transaction);

        const result = await this.transactionService.MonoDeposit(transaction);

        return res.send(result.payUrl);
    }

    @Post('/callback')
    async cCallbackTransaction(@Res() res: Response, @Body() body: MomoCallbackDTO) {
        const transaction = await this.transactionService.findOneByField('id', body.orderId);

        if (transaction) {
            transaction.status = TransactionStatus.SUCCESS;
            transaction.customer.balance += body.amount;
            await this.transactionService.saveTransaction(transaction);
            await this.customerService.saveCustomer(transaction.customer);
        }

        return res.send();
    }
}
