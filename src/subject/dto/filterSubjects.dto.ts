import { SortOrder } from './../../core/interface';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
export class FilterSubjectsDTO {
    @ApiProperty({ description: 'Name', example: 'Subject 1', nullable: true })
    name: string;

    @ApiProperty({ description: 'Is Active', example: 'true', nullable: true })
    isActive: boolean;

    @ApiProperty({ description: 'Is Feature', example: 'true', nullable: true })
    isFeature: boolean;

    @ApiProperty({ description: 'Category Id', example: '123-adf-asdf', nullable: true })
    category: string;

    @ApiProperty({ description: 'User Id', example: '123-adf-asdf', nullable: true })
    assignTo: string;

    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;

    @ApiProperty({ description: 'Created At', example: '18/5/2022', nullable: true })
    createdAt: string;

    @ApiProperty({ description: 'Sort', example: 'ASC', nullable: true })
    order: SortOrder;
}

export const vFilterSubjectsDTO = joi.object<FilterSubjectsDTO>({
    name: joi.string().trim().required().failover(''),
    isActive: joi.boolean().required().failover(null),
    isFeature: joi.boolean().required().failover(null),
    category: joi.string().trim().required().failover(''),
    assignTo: joi.string().trim().required().failover(''),
    createdAt: joi.string().trim().required().failover('1/1/2022'),
    currentPage: joi.number().min(0).required().failover(0),
    pageSize: joi.number().min(1).required().failover(4),
    order: joi.string().trim().required().valid(SortOrder.ASC, SortOrder.DESC).failover(SortOrder.DESC),
});
