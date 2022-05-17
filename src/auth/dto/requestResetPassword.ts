import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { userValidateSchema } from 'src/core/models';

export class RequestResetPasswordDTO {
    @ApiProperty({ description: 'Password', example: 'Aa123456' })
    password: string;

    @ApiProperty({ description: 'Confirm password', example: 'Aa123456' })
    confirmPassword: string;

    @ApiProperty({
        description: 'Reset Password token',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZmI4NDlkLTliNzktNGIxZi05ZmJlLTEyMWE0Njk2YTcxMCIsImlhdCI6MTY1MjUxMzQxMywiZXhwIjoxNjUyNTEzNzEzfQ.U0S2sK4Sv4bYTZ_nKJcbvxTAz5EydHRnkbp-2EyLTO4',
    })
    token: string;
}

export const vRequestResetPasswordDTO = joi.object<RequestResetPasswordDTO>({
    password: userValidateSchema.password,
    confirmPassword: joi
        .string()
        .required()
        .valid(joi.ref('password'))
        .messages({
            ...JoiMessage.createStringMessages({ field: 'Confirm password' }),
            'any.only': 'Confirm password should match with password',
        }),
    token: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Token' })),
});
