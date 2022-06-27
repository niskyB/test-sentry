import { JoiMessage } from 'joi-message';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { quizValidateSchema } from '../../core/models';

export class CreatePracticeQuizDTO {
    @ApiProperty({ description: 'Subject Id', example: 'adfa-asdf-asef' })
    subject: string;

    @ApiProperty({ description: 'Number Of Question', example: '50' })
    numberOfQuestion: number;

    @ApiProperty({ description: 'Subject Topic Id', example: 'adfa-asdf-asef' })
    subjectTopic: string;

    @ApiProperty({ description: 'Dimension Id', example: 'adfa-asdf-asef' })
    dimension: string;
}

export const vCreatePracticeQuizDTO = joi.object<CreatePracticeQuizDTO>({
    subject: joi
        .string()
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Subject' })),
    numberOfQuestion: quizValidateSchema.numberOfQuestion,
    subjectTopic: joi.string().trim().required().failover(''),
    dimension: joi.string().trim().required().failover(''),
});
