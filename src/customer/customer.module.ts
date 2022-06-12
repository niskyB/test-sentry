import { Customer } from './../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from '../core/repositories';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Customer])],
    providers: [CustomerService, { provide: CustomerRepository, useFactory: (connection: Connection) => connection.getCustomRepository(CustomerRepository), inject: [Connection] }],
    controllers: [CustomerController],
    exports: [CustomerService],
})
export class CustomerModule {}
