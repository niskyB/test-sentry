import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
export class FilterQuizResultsDTO {
    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;
}

export const vFilterQuizResultsDTO = joi.object<FilterQuizResultsDTO>({
    currentPage: joi.number().min(0).required().failover(0),
    pageSize: joi.number().min(1).required().failover(4),
});
