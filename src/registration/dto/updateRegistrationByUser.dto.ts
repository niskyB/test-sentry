import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class UpdateRegistrationByUserDTO {
    @ApiProperty({ description: 'Price package', example: 'package id' })
    pricePackage: string;

    @ApiProperty({ description: 'Note', example: 'cc' })
    notes: string;
}

export const vUpdateRegistrationByUserDTO = joi.object<UpdateRegistrationByUserDTO>({
    pricePackage: joi.string().required().failover(''),
    notes: joi.string().required().failover(''),
});
