import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { Gender, userValidateSchema } from '../../core/models';
export class UpdateUserDTO {
    @ApiProperty({ description: 'Full Name', example: 'Hoang Loocccc' })
    fullName: string;

    @ApiProperty({ description: 'Gender', example: 'male' })
    gender: Gender;

    @ApiProperty({ description: 'Mobile', example: '0993954239' })
    mobile: string;
}

export const vUpdateUserDTO = joi.object<UpdateUserDTO>({
    fullName: userValidateSchema.fullName.failover(''),
    gender: userValidateSchema.gender.failover(''),
    mobile: userValidateSchema.mobile.failover(''),
});
