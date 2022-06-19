import { Marketing } from './marketing';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

@Entity()
export class Slider {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Title' })
    @Column({ default: null })
    title: string;

    @ApiProperty({ description: 'Image Url' })
    @Column({ default: null })
    imageUrl: string;

    @ApiProperty({ description: 'Back Link' })
    @Column({ default: null })
    backLink: string;

    @ApiProperty({ description: 'Notes' })
    @Column({ default: null })
    notes: string;

    @ApiProperty({ description: 'Is Show' })
    @Column({ default: true })
    isShow: boolean;

    @ApiProperty({ description: 'Created at' })
    @Column()
    createdAt: string;

    @ApiProperty({ description: 'Marketing' })
    @ManyToOne(() => Marketing)
    marketing: Marketing;
}

export const sliderValidateSchema = {
    title: joi
        .string()
        .min(3)
        .max(255)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Title', min: 3, max: 255 })),
    backLink: joi
        .string()
        .max(255)
        .trim()
        .lowercase()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Back Link', max: 255 })),
    isShow: joi
        .boolean()
        .required()
        .messages(JoiMessage.createBooleanMessages({ field: 'Is Show' })),
    notes: joi
        .string()
        .min(3)
        .max(255)
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Notes' })),
};
