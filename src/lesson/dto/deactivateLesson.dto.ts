import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

export class DeactivateLessonDTO {
    @ApiProperty({ description: 'Is Active', example: 'true' })
    isActive: boolean;
}

export const vDeactivateLessonDTO = joi.object<DeactivateLessonDTO>({
    isActive: joi
        .boolean()
        .required()
        .messages(JoiMessage.createBooleanMessages({ field: 'Is Active' })),
});
