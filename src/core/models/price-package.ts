import { Subject } from './subject';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

@Entity()
export class PricePackage {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Name' })
    @Column({ default: null })
    name: string;

    @ApiProperty({ description: 'Original Price' })
    @Column({ default: null })
    originalPrice: number;

    @ApiProperty({ description: 'Sale Price' })
    @Column({ default: null })
    salePrice: number;

    @ApiProperty({ description: 'Duration' })
    @Column({ default: null })
    duration: number;

    @ApiProperty({ description: 'Is Active' })
    @Column({ default: true })
    isActive: boolean;

    @ApiProperty({ description: 'Created at' })
    @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    createdAt: Date;

    @ApiProperty({ description: 'Updated at' })
    @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    updatedAt: Date;

    @ApiProperty({ description: 'Marketing' })
    @ManyToOne(() => Subject)
    subject: Subject[];
}

export const pricePackageValidateSchema = {
    title: joi
        .string()
        .min(3)
        .max(40)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Title', min: 3, max: 40 })),
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
};
