import { lessonValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

export class CreateLessonDTO {
    @ApiProperty({ description: 'Name', example: 'Javascript' })
    name: string;

    @ApiProperty({ description: 'Order', example: '1' })
    order: number;

    @ApiProperty({ description: 'Type id', example: '12a-123asdf-a23ad-32a' })
    typeId: string;

    @ApiProperty({ description: 'Subject id', example: '12a-123asdf-a23ad-32a' })
    subjectId: string;
}

export const vCreateLessonDTO = joi.object<CreateLessonDTO>({
    name: lessonValidateSchema.name,
    order: lessonValidateSchema.order,
    typeId: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Type' })),
    subjectId: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Subject' })),
});
