import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

    @ApiProperty({ description: 'Html Content' })
    @Column('longtext', { default: null })
    htmlContent: string;

    @ApiProperty({ description: 'Lesson' })
    @OneToOne(() => Lesson, { nullable: false, cascade: true })
    @JoinColumn()
    lesson: Lesson;

    @ApiProperty({ description: 'Quiz' })
    @ManyToMany(() => Quiz)
    @JoinTable({ name: 'lesson_quiz_details' })
    quizzes: Quiz[];
}

export const lessonQuizValidateSchema = {
    htmlContent: joi
        .string()
        .min(3)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Description', min: 3 })),
};
