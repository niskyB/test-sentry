import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class FilterLessonDTO {
    @ApiProperty({ description: 'Title', example: 'Lesson 1', nullable: true })
    title: string;

    @ApiProperty({ description: 'Lesson Type', example: 'Lesson Detail', nullable: true })
    type: string;

    @ApiProperty({ description: 'Created At', example: '01/01/2022', nullable: true })
    createdAt: string;

    @ApiProperty({ description: 'Updated At', example: '01/01/2022', nullable: true })
    updatedAt: string;

    @ApiProperty({ description: 'Is Active', example: 'true', nullable: true })
    isActive: boolean;
}

export const vFilterLessonDTO = joi.object<FilterLessonDTO>({
    title: joi.string().required().failover(''),
    type: joi.string().required().failover(''),
    createdAt: joi.string().required().failover('01/01/2022'),
    updatedAt: joi.string().required().failover('01/01/2022'),
    isActive: joi.boolean().required().failover(null),
});
