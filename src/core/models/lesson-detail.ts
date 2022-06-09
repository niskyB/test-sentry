import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { Lesson } from './lesson';

@Entity()
export class LessonDetail {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Description' })
    @Column('longtext', { default: null })
    description: string;

    @ApiProperty({ description: 'Video link' })
    @Column('longtext', { default: null })
    videoLink: string;

    @ApiProperty({ description: 'Lesson' })
    @OneToOne(() => Lesson)
    lesson: Lesson;
}

export const lessonDetailValidateSchema = {
    description: joi
        .string()
        .min(3)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Description', min: 3 })),
    videoLink: joi
        .string()
        .min(3)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Video Link', min: 3 })),
};
