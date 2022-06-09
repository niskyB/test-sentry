import { subjectValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

export class CreateSubjectDTO {
    @ApiProperty({ description: 'Name', example: 'Subject 1' })
    name: string;

    @ApiProperty({ description: 'Tag Line', example: 'Tag Line 1' })
    tagLine: string;

    @ApiProperty({ description: 'Description', example: 'Description 1' })
    description: string;

    @ApiProperty({ description: 'Category Id', example: 'aoss-sf-asfaass-sfasd' })
    category: string;

    @ApiProperty({ description: 'Assign To', example: 'aoss-sf-asfaass-sfasd' })
    assignTo: string;
}

export const vCreateSubjectDTO = joi.object<CreateSubjectDTO>({
    name: subjectValidateSchema.name,
    tagLine: subjectValidateSchema.tagLine,
    description: subjectValidateSchema.description,
    category: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Category' })),
    assignTo: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Assign To' })),
});
