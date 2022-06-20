import { Subject } from './subject';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { QuizType } from './quiz-type';
import { ExamLevel } from './exam-level';

@Entity()
export class Quiz {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Name' })
    @Column({ default: null })
    name: string;

    @ApiProperty({ description: 'Duration' })
    @Column({ default: null })
    duration: number;

    @ApiProperty({ description: 'Pass Rate' })
    @Column({ default: null })
    passRate: number;

    @ApiProperty({ description: 'Number of question' })
    @Column({ default: null })
    numberOfQuestion: number;

    @ApiProperty({ description: 'Is public' })
    @Column({ nullable: false, default: true })
    isPublic: boolean;

    @ApiProperty({ description: 'Quiz Type' })
    @ManyToOne(() => QuizType, { nullable: false })
    type: QuizType;

    @ApiProperty({ description: 'Exam level' })
    @ManyToOne(() => ExamLevel, { nullable: false })
    level: ExamLevel;

    @ApiProperty({ description: 'Subject' })
    @ManyToOne(() => Subject, { nullable: false })
    subject: Subject;
}

export const quizValidateSchema = {
    name: joi
        .string()
        .min(3)
        .max(40)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Name', min: 3, max: 40 })),
    duration: joi
        .number()
        .min(1)
        .required()
        .messages(JoiMessage.createNumberMessages({ field: 'Duration', min: 1 })),
    passRate: joi
        .number()
        .min(1)
        .max(100)
        .required()
        .messages(JoiMessage.createNumberMessages({ field: 'Pass Rate', min: 1, max: 100 })),
    numberOfQuestion: joi
        .number()
        .min(1)
        .required()
        .messages(JoiMessage.createNumberMessages({ field: 'Number of Question', min: 1 })),
    isPublic: joi
        .boolean()
        .required()
        .messages(JoiMessage.createBooleanMessages({ field: 'Is Public' })),
};
