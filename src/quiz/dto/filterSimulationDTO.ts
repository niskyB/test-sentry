import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class FilterSimulationExamsDTO {
    @ApiProperty({ description: 'Subject id', example: 'asdf-asds-aaasdf' })
    subject: string;

    @ApiProperty({ description: 'Name', example: 'Quiz 1' })
    name: string;

    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;
}

export const vFilterSimulationExamsDTO = joi.object<FilterSimulationExamsDTO>({
    name: joi.string().required().failover(''),
    subject: joi.string().required().failover(''),
    currentPage: joi.number().min(0).required().failover(0),
    pageSize: joi.number().min(1).required().failover(4),
});
