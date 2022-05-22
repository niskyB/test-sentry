import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { blogValidateSchema } from '../../core/models';
export class UpdateBlogDTO {
    @ApiProperty({ description: 'Title', example: 'Title 1' })
    title: string;

    @ApiProperty({ description: 'Details', example: 'abcdefgh' })
    details: string;

    @ApiProperty({ description: 'Brief Info', example: 'brief information' })
    briefInfo: string;

    @ApiProperty({ description: 'Is Show' })
    isShow: boolean;

    @ApiProperty({ description: 'Category', example: 'Category' })
    category: string;
}

export const vUpdateBlogDTO = joi.object<UpdateBlogDTO>({
    title: blogValidateSchema.title.failover(''),
    details: blogValidateSchema.details.failover(''),
    briefInfo: blogValidateSchema.briefInfo.failover(''),
    isShow: blogValidateSchema.isShow.failover(null),
    category: joi.string().required().failover(''),
});
