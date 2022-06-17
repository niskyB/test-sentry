import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { Customer } from './customer';

export enum RegistrationStatus {
    SUBMITTED = 'submitted',
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
    @Column()
    validForm: string;

    @ApiProperty({ description: 'Valid To' })
    @Column()
    validTo: string;

    @ApiProperty({ description: 'Status' })
    @Column()
    status: RegistrationStatus;
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
        .valid(RegistrationStatus.INACTIVE, RegistrationStatus.PAID, RegistrationStatus.SUBMITTED)
        .messages(JoiMessage.createStringMessages({ field: 'Status' })),
    registrationTime: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Registration time' })),
    validFrom: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Valid from' })),
    validTo: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Valid to' })),
};
