import { ResponseMessage } from './../../core/interface';
import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { userValidateSchema, Gender, UserRole } from '../../core/models';
import JoiMessage from 'joi-message';
export class CreateUserDTO {
    @ApiProperty({ description: 'Email', example: 'hoanglocst900@gmail.com' })
    email: string;

    @ApiProperty({ description: 'Password', example: 'Aa123456' })
    password: string;

    @ApiProperty({ description: 'Confirm Password', example: 'Aa123456' })
    confirmPassword: string;

    @ApiProperty({ description: 'Full Name', example: 'Nguyen Hoang Loc' })
    fullName: string;

    @ApiProperty({ description: 'Gender', example: 'male' })
    gender: Gender;

    @ApiProperty({ description: 'Phone Number', example: '0123445567' })
    mobile: string;

    @ApiProperty({ description: 'Role', example: 'marketing' })
    role: UserRole;
}

export const vCreateUserDTO = joi.object<CreateUserDTO>({
    email: userValidateSchema.email,
    password: userValidateSchema.password,
    confirmPassword: joi
        .string()
        .required()
        .valid(joi.ref('password'))
        .messages({
            ...JoiMessage.createStringMessages({ field: 'Confirm password' }),
            'any.only': ResponseMessage.INVALID_CONFIRM_PASSWORD,
        }),
    fullName: userValidateSchema.fullName,
    gender: userValidateSchema.gender,
    mobile: userValidateSchema.mobile,
    role: joi.string().trim().valid(UserRole.MARKETING, UserRole.SALE, UserRole.EXPERT).required(),
});
