import { Gender, registrationValidateSchema } from '../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class UpdateSpecificInformationDTO {
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
}

export const vUpdateSpecificInformationDTO = joi.object<UpdateSpecificInformationDTO>({
    pricePackage: joi.string().required().failover(''),
    fullName: joi.string().required().failover(''),
    email: joi.string().required().failover(''),
    mobile: joi.string().required().failover(''),
    gender: joi.string().required().failover(''),
    registrationTime: registrationValidateSchema.registrationTime.failover(''),
});
