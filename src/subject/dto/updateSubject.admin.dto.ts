import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
export class UpdateSubjectAdminDTO {
    @ApiProperty({ description: 'Assign To', example: 'asas-adsfas-abaadsf' })
    assignTo: string;

    @ApiProperty({ description: 'Is Active', example: 'true' })
    isActive: boolean;
}

export const vUpdateSubjectAdminDTO = joi.object<UpdateSubjectAdminDTO>({
    assignTo: joi.string().required().failover(''),
    isActive: joi.boolean().required().failover(null),
});
