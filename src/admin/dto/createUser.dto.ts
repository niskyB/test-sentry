import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { userValidateSchema, Gender, UserRole } from '../../core/models';
import JoiMessage from 'joi-message';
export class CreateUserDTO {
    @ApiProperty({ description: 'Email', example: 'hoanglocst900@gmail.com' })
    email: string;

    @ApiProperty({ description: 'Full Name', example: 'Nguyen Hoang Loc' })
    fullName: string;

    @ApiProperty({ description: 'Gender', example: 'male' })
    gender: Gender;

    @ApiProperty({ description: 'Phone Number', example: '0123445567' })
    mobile: string;

    @ApiProperty({ description: 'Is Active', example: '0123445567' })
    isActive: boolean;

    @ApiProperty({ description: 'Role', example: 'marketing' })
    role: UserRole;
}

export const vCreateUserDTO = joi.object<CreateUserDTO>({
    email: userValidateSchema.email,
    fullName: userValidateSchema.fullName,
    gender: userValidateSchema.gender,
    mobile: userValidateSchema.mobile,
    isActive: joi
        .boolean()
        .required()
        .messages(JoiMessage.createBooleanMessages({ field: 'isActive' })),
    role: joi.string().trim().valid(UserRole.MARKETING, UserRole.SALE, UserRole.EXPERT).required(),
});
