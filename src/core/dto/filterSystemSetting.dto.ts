import { constant } from './../../core/constant';
import { SortOrder } from './../../core/interface';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

const { currentPage, pageSize, orderBy } = constant.default;

export class FilterSystemSettingsDTO {
    @ApiProperty({ description: 'Value', example: 'asdf-asds-aaasdf', nullable: true })
    value: string;

    @ApiProperty({ description: 'Name', example: 'Quiz 1', nullable: true })
    isActive: boolean;

    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;

    @ApiProperty({ description: 'Order', example: 'ASC', nullable: true })
    order: SortOrder;

    @ApiProperty({ description: 'Order By', example: 'name', nullable: true })
    orderBy: string;
}

export const vFilterSystemSettingsDTO = joi.object<FilterSystemSettingsDTO>({
    value: joi.string().required().failover(''),
    isActive: joi.boolean().required().failover(null),
    currentPage: joi.number().min(0).required().failover(currentPage),
    pageSize: joi.number().min(1).required().failover(pageSize),
    orderBy: joi.string().failover(orderBy).required(),
    order: joi.string().allow('').failover(SortOrder.ASC).valid(SortOrder.ASC, SortOrder.DESC).required(),
});
