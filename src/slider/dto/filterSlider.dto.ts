import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
export class FilterSlidersDTO {
    @ApiProperty({ description: 'Title', example: 'Slider 1', nullable: true })
    title: string;

    @ApiProperty({ description: 'Back Link', example: 'backLink123', nullable: true })
    backLink: string;

    @ApiProperty({ description: 'User Id', example: '123456789', nullable: true })
    userId: string;

    @ApiProperty({ description: 'Is Show', example: 'true', nullable: true })
    isShow: boolean;

    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;

    @ApiProperty({ description: 'Created At', example: '18/5/2022', nullable: true })
    createdAt: string;
}

export const vFilterSlidersDTO = joi.object<FilterSlidersDTO>({
    title: joi.string().required().failover(''),
    backLink: joi.string().required().failover(''),
    userId: joi.string().required().failover(''),
    isShow: joi.boolean().required().failover(null),
    createdAt: joi.string().required().failover('1/1/2022'),
    currentPage: joi.number().min(0).required().failover(0),
    pageSize: joi.number().min(1).required().failover(4),
});
