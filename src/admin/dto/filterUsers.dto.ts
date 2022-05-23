import { SortOrder } from './../../core/interface';
import { Gender, UserRole, userValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { constant } from '../../core';

const { currentPage, pageSize, orderBy } = constant.default;

export class FilterUsersDTO {
    @ApiProperty({ description: 'Gender', example: 'male', nullable: true })
    gender: Gender;

    @ApiProperty({ description: 'Role', example: 'marketing', nullable: true })
    role: UserRole;

    @ApiProperty({ description: 'Is Active', example: 'true', nullable: true })
    isActive: boolean;

    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;

    @ApiProperty({ description: 'Order by', example: 'name', nullable: true })
    orderBy: string;

    @ApiProperty({ description: 'Order', example: 'asc', nullable: true })
    order: SortOrder;
}

export const vFilterUsersDTO = joi.object<FilterUsersDTO>({
    gender: userValidateSchema.gender.failover(Gender.MALE),
    role: joi.string().required().failover(''),
    isActive: joi.boolean().required().failover(null),
    currentPage: joi.number().failover(currentPage).min(0).required(),
    pageSize: joi.number().failover(pageSize).min(0).required(),
    orderBy: joi.string().failover(orderBy).required(),
    order: joi.string().failover(SortOrder.ASC).valid(SortOrder.ASC, SortOrder.DESC).required(),
});
