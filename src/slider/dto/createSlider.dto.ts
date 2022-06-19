import { sliderValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
export class CreateSliderDTO {
    @ApiProperty({ description: 'Title', example: 'Slider 1' })
    title: string;

    @ApiProperty({ description: 'Back Link', example: 'asdssdsssdsd' })
    backLink: string;

    @ApiProperty({ description: 'Notes', example: 'asdssdsssdsd' })
    notes: string;

    @ApiProperty({ description: 'Is Show', example: 'false' })
    isShow: boolean;
}

export const vCreateSliderDTO = joi.object<CreateSliderDTO>({
    title: sliderValidateSchema.title,
    backLink: sliderValidateSchema.backLink,
    notes: sliderValidateSchema.notes,
    isShow: sliderValidateSchema.isShow,
});
