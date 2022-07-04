import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Customer } from './customer';

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
    @Column({ default: null })
    status: TransactionStatus;

    @ApiProperty({ description: 'Status' })
    @ManyToOne(() => Customer, { nullable: false })
    customer: Customer;
}
