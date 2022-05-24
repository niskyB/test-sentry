import { dimensionValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

export class CreateDimensionDTO {
    @ApiProperty({ description: 'Name', example: 'Dimension 1' })
    name: string;

    @ApiProperty({ description: 'Description', example: 'Description 1' })
    description: string;

    @ApiProperty({ description: 'Type', example: 'Type 1' })
    type: string;
}

export const vCreateDimensionDTO = joi.object<CreateDimensionDTO>({
    name: dimensionValidateSchema.name,
    description: dimensionValidateSchema.description,
    type: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Type' })),
});
