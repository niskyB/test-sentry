import { sliderValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
export class CreateSliderDTO {
    @ApiProperty({ description: 'Title', example: 'Slider 1' })
    title: string;

    @ApiProperty({ description: 'Back Link', example: 'asdssdsssdsd' })
    backLink: string;
}

export const vCreateSliderDTO = joi.object<CreateSliderDTO>({
    title: sliderValidateSchema.title,
    backLink: sliderValidateSchema.backLink,
});
