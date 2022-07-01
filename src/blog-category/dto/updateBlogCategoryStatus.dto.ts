import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateBlogCategoryStatusDTO {
    @ApiProperty({ description: 'Is Active', example: 'false' })
    isActive: boolean;
}

export const vUpdateBlogCategoryStatusDTO = joi.object<UpdateBlogCategoryStatusDTO>({
    isActive: joi.boolean().required().failover(null),
});
