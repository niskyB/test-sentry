import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSystemSettingStatusDTO {
    @ApiProperty({ description: 'Is Active', example: 'false' })
    isActive: boolean;
}

export const vUpdateSystemSettingStatusDTO = joi.object<UpdateSystemSettingStatusDTO>({
    isActive: joi.boolean().required().failover(null),
});
