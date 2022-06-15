import { Subject } from './subject';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { LessonType } from './lesson-type';

@Entity()
export class Lesson {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Name' })
    @Column({ default: null })
    name: string;

    @ApiProperty({ description: 'Topic' })
    @Column({ default: null })
    topic: string;

    @ApiProperty({ description: 'Order' })
    @Column({ default: null })
    order: number;

    @ApiProperty({ description: 'Is Active' })
    @Column({ default: true })
    isActive: boolean;

    @ApiProperty({ description: 'Created at' })
    @Column()
    createdAt: string;

    @ApiProperty({ description: 'Updated at' })
    @Column()
    updatedAt: string;

    @ApiProperty({ description: 'Lesson Type' })
    @ManyToOne(() => LessonType)
    type: LessonType;

    @ApiProperty({ description: 'Subject' })
    @ManyToOne(() => Subject)
    subject: Subject;
}

export const lessonValidateSchema = {
    name: joi
        .string()
        .min(3)
        .max(40)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Name', min: 3, max: 40 })),
    order: joi
        .number()
        .min(1)
        .required()
        .messages(JoiMessage.createNumberMessages({ field: 'Order' })),
    topic: joi
        .string()
        .required()
        .max(255)
        .trim()
        .messages(JoiMessage.createStringMessages({ field: 'Topic' })),
};
