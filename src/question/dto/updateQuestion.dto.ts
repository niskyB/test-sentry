import { JoiMessage } from 'joi-message';
import { questionValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class UpdateQuestionDTO {
    @ApiProperty({ description: 'Content', example: 'Content 123 123' })
    content: string;

    @ApiProperty({ description: 'Link', example: 'asdssdsssdsd' })
    videoLink: string;

    @ApiProperty({ description: 'Audio Link', example: 'asdssdsssdsd' })
    audioLink: string;

    @ApiProperty({ description: 'Explanation', example: 'asdssdsssdsd' })
    explanation: string;

    @ApiProperty({ description: 'Is Multiple Choice', example: 'false' })
    isMultipleChoice: boolean;

    @ApiProperty({ description: 'Is Active', example: 'true' })
    isActive: boolean;

    @ApiProperty({ description: 'Question Level Id', example: '123-asd21-asd2' })
    questionLevel: string;

    @ApiProperty({ description: 'Answer', example: '123-asd21-asd2' })
    answers: string;

    @ApiProperty({ description: 'Image', example: 'aadvadsv' })
    image: Express.Multer.File;
}

export const vUpdateQuestionDTO = joi.object<UpdateQuestionDTO>({
    content: questionValidateSchema.content.failover(''),
    videoLink: questionValidateSchema.videoLink.failover(''),
    audioLink: questionValidateSchema.audioLink.failover(''),
    isMultipleChoice: questionValidateSchema.isMultipleChoice.failover(null),
    explanation: questionValidateSchema.explanation.failover(''),
    answers: joi
        .string()
        .required()
        .messages(JoiMessage.createArrayMessages({ field: 'Answers' })),
    questionLevel: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Question level' }))
        .failover(''),
    isActive: joi
        .boolean()
        .required()
        .messages(JoiMessage.createBooleanMessages({ field: 'Is Active' }))
        .failover(null),
    image: joi
        .object({
            filename: joi.string().required().failover(''),
            path: joi.string().required().failover(''),
            bytes: joi.number().required().failover(''),
        })
        .failover(null),
});
