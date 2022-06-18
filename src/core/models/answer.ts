import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { Question } from './question';

@Entity()
export class Answer {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Detail' })
    @Column({ default: null })
    detail: string;

    @ApiProperty({ description: 'Is Correct' })
    @Column({ nullable: false })
    isCorrect: boolean;

    @ApiProperty({ description: 'Question' })
    @ManyToOne(() => Question, { nullable: false })
    question: Question;
}

export const answerValidateSchema = {
    detail: joi
        .string()
        .min(3)
        .max(255)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Detail', min: 3, max: 255 })),
    isCorrect: joi
        .boolean()
        .required()
        .messages(JoiMessage.createBooleanMessages({ field: 'Is Correct' })),
};
