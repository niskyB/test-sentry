import { JoiMessage } from 'joi-message';
import { pricePackageValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class UpdatePricePackageDTO {
    @ApiProperty({ description: 'Name', example: 'Price package 1' })
    name: string;

    @ApiProperty({ description: 'Original Price', example: '123000' })
    originalPrice: number;

    @ApiProperty({ description: 'Sale Price', example: '100000' })
    salePrice: number;

    @ApiProperty({ description: 'Duration', example: '3' })
    duration: number;

    @ApiProperty({ description: 'Description', example: 'abcdefg' })
    description: string;

    @ApiProperty({ description: 'Subject Id', example: '123-123-123' })
    subjectId: string;
}

export const vUpdatePricePackageDTO = joi.object<UpdatePricePackageDTO>({
    name: pricePackageValidateSchema.name.failover(''),
    originalPrice: pricePackageValidateSchema.originalPrice.failover(-1),
    salePrice: pricePackageValidateSchema.salePrice.failover(-1),
    duration: pricePackageValidateSchema.duration.failover(-1),
    description: pricePackageValidateSchema.description.failover(''),
    subjectId: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Subject' })),
});
