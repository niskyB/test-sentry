import { lessonDetailValidateSchema, lessonValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

export class CreateLessonDTO {
    @ApiProperty({ description: 'Name', example: 'Javascript' })
    name: string;

    @ApiProperty({ description: 'Description' })
    description: string;

    @ApiProperty({ description: 'Video link' })
    videoLink: string;

    @ApiProperty({ description: 'Order', example: '1' })
    order: number;

    @ApiProperty({ description: 'Type id', example: '12a-123asdf-a23ad-32a' })
    type: string;

    @ApiProperty({ description: 'Subject id', example: '12a-123asdf-a23ad-32a' })
    subject: string;

    @ApiProperty({ description: 'Array of quiz id', example: '12a-123asdf-a23ad-32a,129-a2sf-123a-23aa' })
    quiz: string;
}

export const vCreateLessonDTO = joi.object<CreateLessonDTO>({
    name: lessonValidateSchema.name,
    order: lessonValidateSchema.order,
    description: lessonDetailValidateSchema.description.failover(''),
    quiz: joi
        .string()
        .required()
        .failover('')
        .messages(JoiMessage.createStringMessages({ field: 'Quiz' })),
    videoLink: lessonDetailValidateSchema.videoLink.failover(''),
    type: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Type' })),
    subject: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Subject' })),
});
