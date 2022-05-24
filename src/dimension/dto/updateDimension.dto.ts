import { dimensionValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class UpdateDimensionDTO {
    @ApiProperty({ description: 'Name', example: 'Dimension 1' })
    name: string;

    @ApiProperty({ description: 'Description', example: 'Description 1' })
    description: string;

    @ApiProperty({ description: 'Type', example: 'Type 1' })
    type: string;
}

export const vUpdateDimensionDTO = joi.object<UpdateDimensionDTO>({
    name: dimensionValidateSchema.name.failover(''),
    description: dimensionValidateSchema.description.failover(''),
    type: joi.string().required().failover(''),
});
