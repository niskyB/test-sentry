import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class UpdateQuizDTO {
    @ApiProperty({ description: 'Name', example: 'Quiz 1' })
    name: string;

    @ApiProperty({ description: 'Duration', example: '50' })
    duration: number;

    @ApiProperty({ description: 'Pass Rate', example: '70' })
    passRate: number;

    @ApiProperty({ description: 'Number Of Question', example: '50' })
    numberOfQuestion: number;

    @ApiProperty({ description: 'Is Public', example: 'true' })
    isPublic: boolean;

    @ApiProperty({ description: 'Quiz Type', example: 'Simulation' })
    type: string;

    @ApiProperty({ description: 'Quiz Level', example: 'Medium' })
    quizLevel: string;

    @ApiProperty({ description: 'Subject', example: '123-1123-123' })
    subject: string;

    @ApiProperty({ description: 'Question' })
    questions: Array<string>;
}

export const vUpdateQuizDTO = joi.object<UpdateQuizDTO>({
    name: joi.string().required().failover(''),
    duration: joi.number().required().min(1).failover(-1),
    passRate: joi.number().required().min(1).failover(-1),
    isPublic: joi.boolean().required().failover(null),
    numberOfQuestion: joi.number().required().min(1).failover(-1),
    type: joi.string().required().failover(''),
    quizLevel: joi.string().required().failover(''),
    subject: joi.string().required().failover(''),
    questions: joi.array().required().failover([]),
});
