import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

export class deactivateLessonDTO {
    @ApiProperty({ description: 'Is Active', example: 'true' })
    isActive: boolean;
}

export const vDeactivateLessonDTO = joi.object<deactivateLessonDTO>({
    isActive: joi
        .boolean()
        .required()
        .messages(JoiMessage.createBooleanMessages({ field: 'Is Active' })),
});
