import { UserRole } from './../../core/models';
import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import JoiMessage from 'joi-message';

export class UpdateUserRoleDTO {
    @ApiProperty({ description: 'Role', example: 'sale' })
    role: UserRole;
}

export const vUpdateUserRoleDTO = joi.object<UpdateUserRoleDTO>({
    role: joi
        .string()
        .required()
        .valid(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.EXPERT, UserRole.MARKETING, UserRole.SALE)
        .messages(JoiMessage.createStringMessages({ field: 'Role' })),
});
