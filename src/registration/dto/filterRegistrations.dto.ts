import { SortOrder } from './../../core/interface';
import { RegistrationStatus, registrationValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { constant } from '../../core';

const { currentPage, pageSize, orderBy } = constant.default;
export class FilterRegistrationsDTO {
    @ApiProperty({ description: 'Subject Id', example: 'asdf asdf asdf ', nullable: true })
    subject: string;

    @ApiProperty({ description: 'Email', example: 'adsfasdf', nullable: true })
    email: string;

    @ApiProperty({ description: 'status', example: RegistrationStatus.SUBMITTED, nullable: true })
    status: RegistrationStatus;

    @ApiProperty({ description: 'Valid from', example: 'cc', nullable: true })
    validFrom: string;

    @ApiProperty({ description: 'Valid to', example: 'cc', nullable: true })
    validTo: string;

    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;

    @ApiProperty({ description: 'Order', example: 'ASC', nullable: true })
    order: SortOrder;

    @ApiProperty({ description: 'Order By', example: 'name', nullable: true })
    orderBy: string;
}

export const vFilterRegistrationsDTO = joi.object<FilterRegistrationsDTO>({
    subject: joi.string().required().failover(''),
    email: joi.string().required().failover(''),
    status: registrationValidateSchema.status.failover(''),
    validFrom: registrationValidateSchema.validFrom.failover('2018-06-25T08:26:17.197Z'),
    validTo: registrationValidateSchema.validTo.failover('2050-06-25T08:26:17.197Z'),
    currentPage: joi.number().min(0).required().failover(currentPage),
    pageSize: joi.number().min(1).required().failover(pageSize),
    orderBy: joi.string().allow('').failover(orderBy).required(),
    order: joi.string().allow('').failover(SortOrder.ASC).valid(SortOrder.ASC, SortOrder.DESC).required(),
});
