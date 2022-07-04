import { config } from '../core/config';
import { CustomerModule } from './../customer/customer.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TransactionRepository } from '../core/repositories';
import { Connection } from 'typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from '../core/models';
import axios from 'axios';

@Module({
    imports: [TypeOrmModule.forFeature([Transaction]), AuthModule, UserModule, CustomerModule],
    controllers: [TransactionController],
    providers: [
        TransactionService,
        { provide: TransactionRepository, useFactory: (connection: Connection) => connection.getCustomRepository(TransactionRepository), inject: [Connection] },
        {
            provide: 'axios',
            useFactory: () => {
                return axios.create({ baseURL: config.MOMO_URL, headers: { ContentType: config.MOMO_REQUEST_CONTENT_TYPE } });
            },
        },
    ],
    exports: [TransactionService],
})
export class TransactionModule {}
