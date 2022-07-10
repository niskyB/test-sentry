import { JoiMessage } from 'joi-message';
import { questionValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class CreateQuestionDTO {
    @ApiProperty({ description: 'Content', example: 'Content 123 123' })
    content: string;

    @ApiProperty({ description: 'Video Link', example: 'asdssdsssdsd' })
    videoLink: string;

    @ApiProperty({ description: 'Image Url', example: 'asdssdsssdsd' })
    imageUrl: string;

    @ApiProperty({ description: 'Audio Link', example: 'asdssdsssdsd' })
    audioLink: string;

    @ApiProperty({ description: 'Explanation', example: 'asdssdsssdsd' })
    explanation: string;

    @ApiProperty({ description: 'Is Multiple Choice', example: 'false' })
    isMultipleChoice: boolean;

    @ApiProperty({ description: 'Is Active', example: 'true' })
    isActive: boolean;

    @ApiProperty({ description: 'Dimension ids', example: '123-asd21-asd2,12aaa-2aca-aq2,12asd-2asc-123zs' })
    dimensions: string;

    @ApiProperty({ description: 'Lesson id', example: '123-asd21-asd2' })
    lesson: string;

    @ApiProperty({ description: 'Question Level Id', example: '123-asd21-asd2' })
    questionLevel: string;

    @ApiProperty({ description: 'Answer', example: '123-asd21-asd2' })
    answers: string;

    @ApiProperty({ description: 'Image', example: 'aadvadsv' })
    image: Express.Multer.File;
}

export const vCreateQuestionDTO = joi.object<CreateQuestionDTO>({
    content: questionValidateSchema.content,
    videoLink: questionValidateSchema.videoLink.failover(''),
    audioLink: questionValidateSchema.audioLink.failover(''),
    imageUrl: joi.string().required().failover(''),
    isMultipleChoice: questionValidateSchema.isMultipleChoice,
    explanation: questionValidateSchema.explanation,
    dimensions: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Dimensions' })),
    lesson: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Lesson' })),
    answers: joi
        .string()
        .required()
        .messages(JoiMessage.createArrayMessages({ field: 'Answers' })),
    questionLevel: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Question level' })),
    isActive: joi
        .boolean()
        .required()
        .messages(JoiMessage.createBooleanMessages({ field: 'Is Active' })),
    image: joi
        .object({
            filename: joi.string().required().failover(''),
            path: joi.string().required().failover(''),
            bytes: joi.number().required().failover(''),
        })
        .failover(null),
});
