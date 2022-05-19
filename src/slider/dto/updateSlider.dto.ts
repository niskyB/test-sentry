import { sliderValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
export class UpdateSliderDTO {
    @ApiProperty({ description: 'Title', example: 'Slider 1' })
    title: string;

    @ApiProperty({ description: 'Back Link', example: 'asdssdsssdsd' })
    backLink: string;
}

export const vUpdateSliderDTO = joi.object<UpdateSliderDTO>({
    title: sliderValidateSchema.title.failover(''),
    backLink: sliderValidateSchema.backLink.failover(''),
});
