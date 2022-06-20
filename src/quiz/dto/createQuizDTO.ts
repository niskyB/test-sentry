import { JoiMessage } from 'joi-message';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { quizValidateSchema } from '../../core/models';

export class CreateQuizDTO {
    @ApiProperty({ description: 'Name', example: 'Quiz 1' })
    name: string;

    @ApiProperty({ description: 'Duration', example: '50' })
    duration: number;

    @ApiProperty({ description: 'Pass Rate', example: '70' })
    passRate: number;

    @ApiProperty({ description: 'Number Of Question', example: '50' })
    numberOfQuestion: number;

    @ApiProperty({ description: 'Is Public', example: 'true' })
    isPublic: boolean;

    @ApiProperty({ description: 'Quiz Type', example: 'Simulation' })
    type: string;

    @ApiProperty({ description: 'Quiz Level', example: 'Medium' })
    level: string;

    @ApiProperty({ description: 'Subject', example: '123-1123-123' })
    subject: string;
}

export const vCreateQuizDTO = joi.object<CreateQuizDTO>({
    name: quizValidateSchema.name,
    duration: quizValidateSchema.duration,
    passRate: quizValidateSchema.passRate,
    isPublic: quizValidateSchema.isPublic,
    type: joi
        .string()
        .required()
        .messages(JoiMessage.createObjectMessages({ field: 'Quiz Type' })),
    level: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Quiz Level' })),
    subject: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Subject' })),
});
