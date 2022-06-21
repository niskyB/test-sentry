import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import JoiMessage from 'joi-message';

export class UpdateUserStatusDTO {
    @ApiProperty({ description: 'Is Active', example: '0123445567' })
    isActive: boolean;
}

export const vUpdateUserStatusDTO = joi.object<UpdateUserStatusDTO>({
    isActive: joi
        .boolean()
        .required()
        .messages(JoiMessage.createBooleanMessages({ field: 'isActive' })),
});
