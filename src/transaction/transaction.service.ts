import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { MomoRequestDTO } from '../core/dto';
import { Transaction } from '../core/models';
import { TransactionRepository } from '../core/repositories';
import * as crypto from 'crypto';
import { config } from '../core';

@Injectable()
export class TransactionService {
    constructor(private readonly transactionRepository: TransactionRepository, @Inject('axios') private readonly axios: AxiosInstance) {}

    async saveTransaction(transaction: Transaction): Promise<Transaction> {
        return await this.transactionRepository.save(transaction);
    }

    async findOneByField(field: keyof Transaction, value: any): Promise<Transaction> {
        return await this.transactionRepository
            .createQueryBuilder('transaction')
            .where(`transaction.${field.toString()} = (:value)`, { value })
            .leftJoinAndSelect('transaction.customer', 'customer')
            .getOne();
    }

    async MonoDeposit(transaction: Transaction) {
        const momoRequest = new MomoRequestDTO();
        momoRequest.amount = transaction.amount;
        momoRequest.orderId = transaction.id;
        momoRequest.requestId = transaction.id;
        momoRequest.accessKey = config.MOMO_ACCESS_KEY;
        momoRequest.extraData = '';
        momoRequest.ipnUrl = config.MOMO_IPN_URL;
        momoRequest.lang = config.MOMO_LANG;
        momoRequest.orderInfo = 'Tra tien dei';
        momoRequest.partnerCode = config.MONO_PARTNER_CODE;
        momoRequest.redirectUrl = config.MOMO_REDIRECT_URL;
        momoRequest.requestType = config.MOMO_REQUEST_TYPE;
        momoRequest.signature = this.createSignature(momoRequest);

        return await this.axios
            .post(config.MOMO_REQUEST_PATH, momoRequest)
            .then((result) => {
                return result.data;
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    }

    private createSignature(momoRequest: MomoRequestDTO) {
        const { accessKey, amount, extraData, ipnUrl, orderId, orderInfo, partnerCode, redirectUrl, requestId, requestType } = momoRequest;
        const value =
            'accessKey=' +
            accessKey +
            '&amount=' +
            amount +
            '&extraData=' +
            extraData +
            '&ipnUrl=' +
            ipnUrl +
            '&orderId=' +
            orderId +
            '&orderInfo=' +
            orderInfo +
            '&partnerCode=' +
            partnerCode +
            '&redirectUrl=' +
            redirectUrl +
            '&requestId=' +
            requestId +
            '&requestType=' +
            requestType;
        return crypto.createHmac('sha256', config.MOMO_SECRET_CONFIG_KEY).update(value).digest('hex');
    }
}
