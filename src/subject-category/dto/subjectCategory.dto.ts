import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import JoiMessage from 'joi-message';
export class SubjectCategoryDTO {
    @ApiProperty({ description: 'Name', example: 'Subject category 1' })
    name: string;
}

export const vSubjectCategoryDTO = joi.object<SubjectCategoryDTO>({
    name: joi
        .string()
        .min(1)
        .max(255)
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Name', min: 1, max: 255 })),
});
