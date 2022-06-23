import { SortOrder } from './../../core/interface';
import { Registration, RegistrationStatus, registrationValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { constant } from '../../core';

const { currentPage, pageSize, orderBy } = constant.default;
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

    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;

    @ApiProperty({ description: 'Created At', example: '18/5/2022', nullable: true })
    order: SortOrder;

    @ApiProperty({ description: 'Order by', example: 'name', nullable: true })
    orderBy: keyof Registration;
}

export const vFilterRegistrationsDTO = joi.object<FilterRegistrationsDTO>({
    subject: joi.string().required().failover(''),
    email: joi.string().required().failover(''),
    status: registrationValidateSchema.status.failover(''),
    validFrom: registrationValidateSchema.validFrom.failover(''),
    validTo: registrationValidateSchema.validTo.failover(''),
    currentPage: joi.number().min(0).required().failover(currentPage),
    pageSize: joi.number().min(1).required().failover(pageSize),
    orderBy: joi.string().allow('').failover(orderBy).required(),
    order: joi.string().allow('').failover(SortOrder.ASC).valid(SortOrder.ASC, SortOrder.DESC).required(),
});
