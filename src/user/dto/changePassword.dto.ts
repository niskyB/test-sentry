import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { userValidateSchema } from '../../core/models';

export class ChangePasswordDTO {
    @ApiProperty({ description: 'Current password', example: 'Aa123456' })
    currentPassword: string;

    @ApiProperty({ description: 'New password', example: '12345678' })
    newPassword: string;

    @ApiProperty({ description: 'Confirm new password', example: '12345678' })
    confirmNewPassword: string;
}

export const vChangePasswordDTO = joi.object<ChangePasswordDTO>({
    currentPassword: userValidateSchema.password,
    newPassword: userValidateSchema.password,
    confirmNewPassword: joi
        .string()
        .required()
        .valid(joi.ref('newPassword'))
        .messages({
            ...JoiMessage.createStringMessages({ field: 'Confirm new password' }),
            'any.only': 'Confirm new password should match with password',
        }),
});
