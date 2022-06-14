import { lessonDetailValidateSchema, lessonValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

export class UpdateLessonDTO {
    @ApiProperty({ description: 'Name', example: 'Javascript' })
    name: string;

    @ApiProperty({ description: 'Html Content' })
    htmlContent: string;

    @ApiProperty({ description: 'Topic' })
    topic: string;

    @ApiProperty({ description: 'Type of current lesson', nullable: false })
    type: string;

    @ApiProperty({ description: 'Video link' })
    videoLink: string;

    @ApiProperty({ description: 'Order', example: '1' })
    order: number;

    @ApiProperty({ description: 'Array of quiz id', example: '12a-123asdf-a23ad-32a,129-a2sf-123a-23aa' })
    quiz: string;
}

export const vUpdateLessonDTO = joi.object<UpdateLessonDTO>({
    name: lessonValidateSchema.name.failover(''),
    order: lessonValidateSchema.order.failover(''),
    htmlContent: lessonDetailValidateSchema.htmlContent.failover(''),
    topic: lessonValidateSchema.topic.failover(''),
    quiz: joi
        .string()
        .required()
        .failover('')
        .messages(JoiMessage.createStringMessages({ field: 'Quiz' })),
    type: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Type' })),
    videoLink: lessonDetailValidateSchema.videoLink.failover(''),
});
