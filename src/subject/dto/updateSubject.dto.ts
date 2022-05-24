import { subjectValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
export class UpdateSubjectDTO {
    @ApiProperty({ description: 'Name', example: 'Subject 1' })
    name: string;

    @ApiProperty({ description: 'Tag Line', example: 'asdssdsssdsd' })
    tagLine: string;

    @ApiProperty({ description: 'Description', example: 'description 1' })
    description: string;

    @ApiProperty({ description: 'Is Active', example: 'true' })
    isActive: boolean;

    @ApiProperty({ description: 'Assign To', example: 'sasdf-awef-wwfwef-21' })
    assignTo: string;
}

export const vUpdateSubjectDTO = joi.object<UpdateSubjectDTO>({
    name: subjectValidateSchema.name.failover(''),
    tagLine: subjectValidateSchema.tagLine.failover(''),
    description: subjectValidateSchema.description.failover(''),
    isActive: joi.boolean().required().failover(null),
    assignTo: joi.string().required().failover(''),
});
