import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class StatisticRevenuesDTO {
    @ApiProperty({ description: 'Subject Id', example: 'asdf-asdf-asdf', nullable: true })
    subject: string;
}

export const vStatisticRevenuesDTO = joi.object<StatisticRevenuesDTO>({
    subject: joi.string().required().failover(''),
});
