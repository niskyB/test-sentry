import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class FilterQuestionDTO {
    @ApiProperty({ description: 'Subject Id', example: 'asdf-aasdf-sadf', nullable: true })
    subject: string;

    @ApiProperty({ description: 'Lesson Id', example: 'asd-sdasdf-aasdf-aas', nullable: true })
    lesson: string;

    @ApiProperty({ description: 'Dimension Id', example: 'asasdf-asdf-sdf', nullable: true })
    dimension: string;

    @ApiProperty({ description: 'Content', example: 'content 123', nullable: true })
    content: string;

    @ApiProperty({ description: 'Level Id', example: 'easy', nullable: true })
    level: string;

    @ApiProperty({ description: 'Is Active', example: 'true', nullable: true })
    isActive: boolean;

    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;
}

export const vFilterQuestionDTO = joi.object<FilterQuestionDTO>({
    content: joi.string().required().failover(''),
    subject: joi.string().required().failover(''),
    lesson: joi.string().required().failover(''),
    dimension: joi.string().required().failover(''),
    level: joi.string().required().failover(''),
    isActive: joi.boolean().required().failover(null),
    currentPage: joi.number().min(0).required().failover(0),
    pageSize: joi.number().min(1).required().failover(4),
});
