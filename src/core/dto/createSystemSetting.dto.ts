import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import JoiMessage from 'joi-message';

export class CreateSystemSettingDTO {
    @ApiProperty({ description: 'Name', example: 'Blog category 1' })
    name: string;
}

export const vCreateSystemSettingDTO = joi.object<CreateSystemSettingDTO>({
    name: joi
        .string()
        .min(1)
        .max(255)
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Name', min: 1, max: 255 })),
});
