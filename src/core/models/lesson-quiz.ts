import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { Lesson } from './lesson';
import { Quiz } from './quiz';

@Entity()
export class LessonQuiz {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Description' })
    @Column('longtext', { default: null })
    description: string;

    @ApiProperty({ description: 'Lesson' })
    @OneToOne(() => Lesson)
    lesson: Lesson;

    @ApiProperty({ description: 'Quiz' })
    @ManyToMany(() => Quiz)
    @JoinTable()
    quizs: Quiz[];
}

export const lessonQuizValidateSchema = {
    description: joi
        .string()
        .min(3)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Description', min: 3 })),
};
