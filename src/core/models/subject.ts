import { PricePackage } from './price-package';
import { SubjectCategory } from './subject-category';
import { Expert } from './expert';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { JoiMessage } from 'joi-message';
import { Lesson } from './lesson';

@Entity()
export class Subject {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Name' })
    @Column({ default: null })
    name: string;

    @ApiProperty({ description: 'Tag Line' })
    @Column({ default: null })
    tagLine: string;

    @ApiProperty({ description: 'Description' })
    @Column('longtext', { default: null })
    description: string;

    @ApiProperty({ description: 'Thumbnail url' })
    @Column({ default: null })
    thumbnailUrl: string;

    @ApiProperty({ description: 'Is Active' })
    @Column({ default: true })
    isActive: boolean;

    @ApiProperty({ description: 'Is Feature' })
    @Column({ default: true })
    isFeature: boolean;

    @ApiProperty({ description: 'Created at' })
    @Column()
    createdAt: string;

    @ApiProperty({ description: 'Updated at' })
    @Column()
    updatedAt: string;

    @ApiProperty({ description: 'Subject Category' })
    @ManyToOne(() => SubjectCategory, { nullable: false })
    category: SubjectCategory;

    @ApiProperty({ description: 'Assign to' })
    @ManyToOne(() => Expert)
    assignTo: Expert;

    @ApiProperty({ description: 'Lesson' })
    @OneToMany(() => Lesson, (lesson) => lesson.subject)
    lessons: Lesson[];

    @ApiProperty({ description: 'Lesson' })
    @OneToMany(() => PricePackage, (pricePackage) => pricePackage.subject)
    pricePackages: PricePackage[];
}

export const subjectValidateSchema = {
    name: joi
        .string()
        .min(3)
        .max(255)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Name', min: 3, max: 255 })),
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
    isFeature: joi
        .boolean()
        .required()
        .messages(JoiMessage.createBooleanMessages({ field: 'Is Feature' })),
    isActive: joi
        .boolean()
        .required()
        .messages(JoiMessage.createBooleanMessages({ field: 'Is Active' })),
};
