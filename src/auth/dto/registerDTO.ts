import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { userValidateSchema } from '../../core/models';
import JoiMessage from 'joi-message';

export class RegisterDTO {
    @ApiProperty({ description: 'Email', example: 'hoanglocst900@gmail.com' })
    email: string;

    @ApiProperty({ description: 'Full name', example: 'Nguyen Hoang Loc' })
    fullName: string;

    @ApiProperty({ description: 'Password', example: 'Aa123456' })
    password: string;

    @ApiProperty({ description: 'Confirm password', example: 'Aa123456' })
    confirmPassword: string;

    @ApiProperty({ description: 'Mobile', example: '0835184222' })
    mobile: string;

    @ApiProperty({ description: 'Gender', example: 'male' })
    gender: string;
}

export const vRegisterDTO = joi.object<RegisterDTO>({
    fullName: userValidateSchema.fullName,
    email: userValidateSchema.email,
    password: userValidateSchema.password,
    confirmPassword: joi
        .string()
        .required()
        .valid(joi.ref('password'))
        .messages({
            ...JoiMessage.createStringMessages({ field: 'Confirm password' }),
            'any.only': 'Confirm password should match with password',
        }),
    mobile: userValidateSchema.mobile,
    gender: userValidateSchema.gender,
});
