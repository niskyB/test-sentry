import { JoiMessage } from 'joi-message';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class StatisticOrderTrendDTO {
    @ApiProperty({ description: 'From', example: '2022-02-02' })
    from: string;

    @ApiProperty({ description: 'To', example: '2022-02-02' })
    to: string;
}

export const vStatisticOrderTrendDTO = joi.object<StatisticOrderTrendDTO>({
    from: joi
        .string()
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'From Date' })),
    to: joi
        .string()
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'To Date' })),
});
