import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from '../core/repositories';

@Module({
    imports: [TypeOrmModule.forFeature([CustomerRepository])],
    providers: [CustomerService],
    controllers: [CustomerController],
    exports: [CustomerService],
})
export class CustomerModule {}
