import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import JoiMessage from 'joi-message';
export class CreateBlogCategoryDTO {
    @ApiProperty({ description: 'Name', example: 'Blog category 1' })
    name: string;
}

export const vCreateBlogCategoryDTO = joi.object<CreateBlogCategoryDTO>({
    name: joi
        .string()
        .min(1)
        .max(255)
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Name', min: 1, max: 255 })),
});
