import { JoiMessage } from 'joi-message';
import { questionValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class CreateQuestionDTO {
    @ApiProperty({ description: 'Content', example: 'Content 123 123' })
    content: string;

    @ApiProperty({ description: 'Link', example: 'asdssdsssdsd' })
    link: string;

    @ApiProperty({ description: 'Audio Link', example: 'asdssdsssdsd' })
    audioLink: string;

    @ApiProperty({ description: 'Is Multiple Choice', example: 'false' })
    isMultipleChoice: boolean;

    @ApiProperty({ description: 'Dimension ids', example: '123-asd21-asd2,12aaa-2aca-aq2,12asd-2asc-123zs' })
    dimensions: string;
}

export const vCreateQuestionDTO = joi.object<CreateQuestionDTO>({
    content: questionValidateSchema.content,
    link: questionValidateSchema.link.failover(''),
    audioLink: questionValidateSchema.audioLink.failover(''),
    isMultipleChoice: questionValidateSchema.isMultipleChoice,
    dimensions: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Dimensions' })),
});
