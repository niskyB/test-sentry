import { JoiMessage } from 'joi-message';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class FilterQuizzesDTO {
    @ApiProperty({ description: 'Subject Id', example: 'asdf-asdf-aasdf' })
    subject: string;

    @ApiProperty({ description: 'Quiz Type Id', example: '123-asdf-12' })
    type: string;

    @ApiProperty({ description: 'Quiz Name', example: 'Quiz 1' })
    name: string;
}

export const vFilterQuizzesDTO = joi.object<FilterQuizzesDTO>({
    name: joi
        .string()
        .required()
        .failover('')
        .messages(JoiMessage.createStringMessages({ field: 'Name' })),
    type: joi
        .string()
        .required()
        .failover('')
        .messages(JoiMessage.createStringMessages({ field: 'Quiz Type' })),
    subject: joi
        .string()
        .required()
        .failover('')
        .messages(JoiMessage.createStringMessages({ field: 'Subject' })),
});
