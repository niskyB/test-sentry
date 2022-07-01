import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubjectCategoryStatusDTO {
    @ApiProperty({ description: 'Is Active', example: 'false' })
    isActive: boolean;
}

export const vUpdateSubjectCategoryStatusDTO = joi.object<UpdateSubjectCategoryStatusDTO>({
    isActive: joi.boolean().required().failover(null),
});
