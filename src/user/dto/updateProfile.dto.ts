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

    @ApiProperty({ description: 'Image', example: 'aadvadsv' })
    image: Express.Multer.File;
}

export const vUpdateUserDTO = joi.object<UpdateUserDTO>({
    fullName: userValidateSchema.fullName.failover(''),
    gender: userValidateSchema.gender.failover(''),
    mobile: userValidateSchema.mobile.failover(''),
    image: joi
        .object({
            filename: joi.string().required().failover(''),
            path: joi.string().required().failover(''),
            bytes: joi.number().required().failover(''),
        })
        .failover(null),
});
