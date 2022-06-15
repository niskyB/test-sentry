import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { Question } from './question';

@Entity()
export class QuestionAnswer {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Content' })
    @ManyToOne(() => Question)
    question: Question;

    @ApiProperty({ description: 'Is Marked' })
    @Column({ default: false })
    isMarked: boolean;
}

export const questionAnswerValidateSchema = {
    isMarked: joi.boolean().messages(JoiMessage.createBooleanMessages({ field: 'Is Marked' })),
};
