import { Answer } from './answer';
import { Lesson } from './lesson';
import { Dimension } from './dimension';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { QuestionLevel } from './question-level';

@Entity()
export class Question {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Content' })
    @Column('longtext', { default: null })
    content: string;

    @ApiProperty({ description: 'Link' })
    @Column('longtext', { default: null })
    videoLink: string;

    @ApiProperty({ description: 'Audio Link' })
    @Column('longtext', { default: null })
    audioLink: string;

    @ApiProperty({ description: 'Image Url' })
    @Column('longtext', { default: null })
    imageUrl: string;

    @ApiProperty({ description: 'Explanation' })
    @Column('longtext', { default: null })
    explanation: string;

    @ApiProperty({ description: 'Is Multiple Choice' })
    @Column({ default: false })
    isMultipleChoice: boolean;

    @ApiProperty({ description: 'Is Active' })
    @Column({ default: true })
    isActive: boolean;

    @ApiProperty({ description: 'Is Old' })
    @Column({ default: false })
    isOld: boolean;

    @ApiProperty({ description: 'Dimensions' })
    @ManyToMany(() => Dimension, { cascade: true })
    @JoinTable()
    dimensions: Dimension[];

    @ApiProperty({ description: 'Lesson' })
    @ManyToOne(() => Lesson, { nullable: false })
    lesson: Lesson;

    @ApiProperty({ description: 'Dimensions' })
    @OneToMany(() => Answer, (answer) => answer.question)
    answers: Answer[];

    @ApiProperty({ description: 'Question Level' })
    @ManyToOne(() => QuestionLevel, { nullable: false })
    questionLevel: QuestionLevel;
}

export const questionValidateSchema = {
    content: joi
        .string()
        .min(3)
        .max(1000)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Content', min: 3, max: 1000 })),
    videoLink: joi
        .string()
        .trim()
        .messages(JoiMessage.createStringMessages({ field: 'Link' })),
    audioLink: joi
        .string()
        .trim()
        .messages(JoiMessage.createStringMessages({ field: 'Audio Link' })),
    explanation: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Explanation' })),
    isMultipleChoice: joi.boolean().messages(JoiMessage.createBooleanMessages({ field: 'Is Multiple Choice' })),
};
