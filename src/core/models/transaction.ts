import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Customer } from './customer';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

export enum TransactionStatus {
    PENDING = 'Pending',
    SUCCESS = 'Success',
}

@Entity()
export class Transaction {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Amount' })
    @Column('double', { default: null })
    amount: number;

    @ApiProperty({ description: 'Status' })
    @Column({ default: TransactionStatus.PENDING })
    status: TransactionStatus;

    @ApiProperty({ description: 'Status' })
    @ManyToOne(() => Customer, { nullable: false })
    customer: Customer;
}

export const transactionValidateSchema = {
    amount: joi
        .number()
        .min(1000)
        .max(50000000)
        .required()
        .messages(JoiMessage.createNumberMessages({ field: 'Amount', min: 1000, max: 50000000 })),
    status: joi
        .string()
        .required()
        .valid(TransactionStatus.SUCCESS, TransactionStatus.PENDING)
        .messages(JoiMessage.createStringMessages({ field: 'Status' })),
};
