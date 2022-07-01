import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import JoiMessage from 'joi-message';
export class CreateSubjectCategoryDTO {
    @ApiProperty({ description: 'Name', example: 'Subject category 1' })
    name: string;
}

export const vCreateSubjectCategoryDTO = joi.object<CreateSubjectCategoryDTO>({
    name: joi
        .string()
        .min(1)
        .max(255)
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Name', min: 1, max: 255 })),
});
