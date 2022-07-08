import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { Customer } from './customer';
import { Sale } from './sale';
import { PricePackage } from './price-package';

export enum RegistrationStatus {
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    CANCELLED = 'cancelled',
    PAID = 'paid',
    INACTIVE = 'inactive',
}

@Entity()
export class Registration {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Customer' })
    @ManyToOne(() => Customer)
    customer: Customer;

    @ApiProperty({ description: 'Registration Time' })
    @Column()
    registrationTime: string;

    @ApiProperty({ description: 'Total cost' })
    @Column()
    totalCost: number;

    @ApiProperty({ description: 'Valid Form' })
    @Column({ default: '' })
    validFrom: string;

    @ApiProperty({ description: 'Valid To' })
    @Column({ default: '' })
    validTo: string;

    @ApiProperty({ description: 'Notes' })
    @Column()
    notes: string;

    @ApiProperty({ description: 'Last Updated By' })
    @Column({ default: '' })
    lastUpdatedBy: string;

    @ApiProperty({ description: 'Status' })
    @Column()
    status: RegistrationStatus;

    @ApiProperty({ description: 'Sale' })
    @ManyToOne(() => Sale)
    sale: Sale;

    @ApiProperty({ description: 'Price Package' })
    @ManyToOne(() => PricePackage, { nullable: false })
    pricePackage: PricePackage;
}

export const registrationValidateSchema = {
    totalCost: joi
        .number()
        .min(1)
        .required()
        .messages(JoiMessage.createNumberMessages({ field: 'Total Cost' })),
    status: joi
        .string()
        .required()
        .valid(RegistrationStatus.INACTIVE, RegistrationStatus.PAID, RegistrationStatus.SUBMITTED, RegistrationStatus.APPROVED, RegistrationStatus.CANCELLED)
        .messages(JoiMessage.createStringMessages({ field: 'Status' })),
    registrationTime: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Registration time' })),
    validFrom: joi
        .string()
        .trim()
        .min(2)
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Valid from' })),
    validTo: joi
        .string()
        .trim()
        .min(2)
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Valid to' })),
};
