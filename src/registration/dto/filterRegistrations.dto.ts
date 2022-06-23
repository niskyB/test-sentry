import { RegistrationStatus, registrationValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class FilterRegistrationsDTO {
    @ApiProperty({ description: 'Subject Id', example: 'asdf asdf asdf ' })
    subject: string;

    @ApiProperty({ description: 'Email' })
    email: string;

    @ApiProperty({ description: 'status', example: RegistrationStatus.SUBMITTED })
    status: RegistrationStatus;

    @ApiProperty({ description: 'Valid from', example: 'cc' })
    validFrom: string;

    @ApiProperty({ description: 'Valid to', example: 'cc' })
    validTo: string;
}

export const vFilterRegistrationsDTO = joi.object<FilterRegistrationsDTO>({
    subject: joi.string().required().failover(''),
    email: joi.string().required().failover(''),
    status: registrationValidateSchema.status.failover(''),
    validFrom: registrationValidateSchema.validFrom.failover(''),
    validTo: registrationValidateSchema.validTo.failover(''),
});
