import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class StatisticRevenuesDTO {
    @ApiProperty({ description: 'Subject Category Id', example: 'asdf-asdf-asdf', nullable: true })
    subjectCategory: string;
}

export const vStatisticRevenuesDTO = joi.object<StatisticRevenuesDTO>({
    subjectCategory: joi.string().required().failover(''),
});
