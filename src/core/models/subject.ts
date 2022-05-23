import { SubjectCategory } from './subject-category';
import { Expert } from './expert';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { JoiMessage } from 'joi-message';

@Entity()
export class Subject {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Title' })
    @Column({ default: null })
    title: string;

    @ApiProperty({ description: 'Tag Line' })
    @Column({ default: null })
    tagLine: string;

    @ApiProperty({ description: 'Description' })
    @Column({ default: null })
    description: string;

    @ApiProperty({ description: 'Thumbnail url' })
    @Column({ default: null })
    thumbnailUrl: string;

    @ApiProperty({ description: 'Created at' })
    @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    createdAt: Date;

    @ApiProperty({ description: 'Updated at' })
    @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    updatedAt: Date;

    @ApiProperty({ description: 'Subject Category' })
    @ManyToOne(() => SubjectCategory)
    category: SubjectCategory;

    @ApiProperty({ description: 'Assign to' })
    @ManyToOne(() => Expert)
    assignTo: Expert;
}

export const subjectValidateSchema = {
    title: joi
        .string()
        .min(3)
        .max(40)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Title', min: 3, max: 40 })),
    tagLine: joi
        .string()
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Tag Line' })),
    description: joi
        .string()
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Description' })),
};
