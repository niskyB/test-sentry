import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TransactionRepository } from '../core/repositories';
import { Connection } from 'typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from '../core/models';

@Module({
    imports: [TypeOrmModule.forFeature([Transaction]), AuthModule, UserModule],
    controllers: [TransactionController],
    providers: [TransactionService, { provide: TransactionRepository, useFactory: (connection: Connection) => connection.getCustomRepository(TransactionRepository), inject: [Connection] }],
    exports: [TransactionService],
})
export class TransactionModule {}
