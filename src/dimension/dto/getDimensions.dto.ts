import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
export class GetDimensionsDTO {
    @ApiProperty({ description: 'Id', example: 'asdf-asdf-wer-123123', nullable: false })
    id: string;

    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;
}

export const vGetDimensionsDTO = joi.object<GetDimensionsDTO>({
    id: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Subject' })),
    currentPage: joi.number().min(0).required().failover(0),
    pageSize: joi.number().min(1).required().failover(4),
});
