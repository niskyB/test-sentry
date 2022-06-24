import { SortOrder } from './../../core/interface/repositories.interface';
import { subjectValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class FilterMyRegistrationsDTO {
    @ApiProperty({ description: 'Subject name', example: 'subject 1', nullable: true })
    name: string;

    @ApiProperty({ description: 'Subject category id', example: '12asd-asdf-adsf', nullable: true })
    category: string;

    @ApiProperty({ description: 'Is Feature', example: 'true', nullable: true })
    isFeature: boolean;

    @ApiProperty({ description: 'Created At', example: '18/5/2022', nullable: true })
    order: SortOrder;

    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;
}

export const vFilterMyRegistrationsDTO = joi.object<FilterMyRegistrationsDTO>({
    name: subjectValidateSchema.name.failover(''),
    isFeature: joi.boolean().required().failover(null),
    category: joi.string().required().failover(''),
    order: joi.string().required().valid(SortOrder.ASC, SortOrder.DESC).failover(SortOrder.DESC),
    currentPage: joi.number().min(0).required().failover(0),
    pageSize: joi.number().min(1).required().failover(4),
});
