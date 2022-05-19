import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { blogValidateSchema } from '../../core/models';
export class CreateBlogDTO {
    @ApiProperty({ description: 'Title', example: 'Title 1' })
    title: string;

    @ApiProperty({ description: 'Details', example: 'abcdefgh' })
    details: string;

    @ApiProperty({ description: 'Brief Info', example: 'brief information' })
    briefInfo: string;
}

export const vCreateBlogDTO = joi.object<CreateBlogDTO>({
    title: blogValidateSchema.title,
    details: blogValidateSchema.details,
    briefInfo: blogValidateSchema.briefInfo,
});
