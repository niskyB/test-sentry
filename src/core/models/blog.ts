import { Marketing } from './marketing';
import { JoiMessage } from 'joi-message';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { BlogCategory } from './blog-category';

@Entity()
export class Blog {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Title' })
    @Column({ default: null })
    title: string;

    @ApiProperty({ description: 'Thumbnail Url' })
    @Column({ default: null })
    thumbnailUrl: string;

    @ApiProperty({ description: 'Details' })
    @Column({ default: null })
    details: string;

    @ApiProperty({ description: 'Brief Info' })
    @Column({ default: null })
    briefInfo: string;

    @ApiProperty({ description: 'Is Show' })
    @Column({ default: true })
    isShow: boolean;

    @ApiProperty({ description: 'Created at' })
    @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    createdAt: Date;

    @ApiProperty({ description: 'Updated at' })
    @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    updatedAt: Date;

    @ApiProperty({ description: 'Marketing' })
    @ManyToOne(() => Marketing)
    marketing: Marketing;

    @ApiProperty({ description: 'Blog Category' })
    @ManyToOne(() => BlogCategory)
    category: BlogCategory;
}

export const blogValidateSchema = {
    title: joi
        .string()
        .min(3)
        .max(40)
        .trim()
        .lowercase()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Title', min: 3, max: 40 })),
    details: joi
        .string()
        .trim()
        .lowercase()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Details' })),
    briefInfo: joi
        .string()
        .trim()
        .lowercase()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Breaf Info' })),
    isShow: joi
        .boolean()
        .required()
        .messages(JoiMessage.createBooleanMessages({ field: 'Is Show' })),
};
