import { Gender, RegistrationStatus, registrationValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class UpdateRegistrationDTO {
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

    @ApiProperty({ description: 'Valid from', example: 'cc' })
    validFrom: string;

    @ApiProperty({ description: 'Valid to', example: 'cc' })
    validTo: string;

    @ApiProperty({ description: 'Note', example: 'cc' })
    notes: string;

    @ApiProperty({ description: 'User Id', example: 'cc' })
    sale: string;
}

export const vUpdateRegistrationDTO = joi.object<UpdateRegistrationDTO>({
    pricePackage: joi.string().required().failover(''),
    fullName: joi.string().required().failover(''),
    email: joi.string().required().failover(''),
    mobile: joi.string().required().failover(''),
    gender: joi.string().required().failover(''),
    status: registrationValidateSchema.status.failover(''),
    registrationTime: registrationValidateSchema.registrationTime.failover(''),
    validFrom: registrationValidateSchema.validFrom.failover(''),
    validTo: registrationValidateSchema.validTo.failover(''),
    notes: joi.string().required().failover(''),
});
