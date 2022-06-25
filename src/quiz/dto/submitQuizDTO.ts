import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

export class SubmitQuizDTO {
    @ApiProperty({ description: '' })
    data: Array<any>;
}

export const vSubmitQuizDTO = joi.object<SubmitQuizDTO>({
    data: joi
        .array()
        .required()
        .messages(JoiMessage.createArrayMessages({ field: 'Data' })),
});
