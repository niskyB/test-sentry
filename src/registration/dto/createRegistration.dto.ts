import { Gender, RegistrationStatus, registrationValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

export class CreateRegistrationDTO {
    @ApiProperty({ description: 'Price package', example: 'package id' })
    pricePackage: string;

    @ApiProperty({ description: 'Full name' })
    fullName: string;

    @ApiProperty({ description: 'Email' })
    email: string;

    @ApiProperty({ description: 'Mobile' })
    mobile: string;

    @ApiProperty({ description: 'Gender', example: Gender.MALE })
    gender: Gender;

    @ApiProperty({ description: 'Registration Time', example: 'cc' })
    registrationTime: string;

    @ApiProperty({ description: 'status', example: RegistrationStatus.SUBMITTED })
    status: RegistrationStatus;

    @ApiProperty({ description: 'Note', example: 'cc' })
    notes: string;

    @ApiProperty({ description: 'User Id', example: 'cc' })
    sale: string;
}

export const vCreateRegistrationDTO = joi.object<CreateRegistrationDTO>({
    pricePackage: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'price Package' })),
    fullName: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Full name' })),
    email: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Email' })),
    mobile: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'mobile' })),
    gender: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'gender' })),
    status: registrationValidateSchema.status,
    registrationTime: registrationValidateSchema.registrationTime,
    notes: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'note' })),
    sale: joi.string().required().failover(''),
});
