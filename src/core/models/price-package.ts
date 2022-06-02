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
    subject: Subject;
}

export const pricePackageValidateSchema = {
    name: joi
        .string()
        .min(3)
        .max(255)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Name', min: 3, max: 255 })),
    originalPrice: joi
        .number()
        .min(1)
        .required()
        .messages(JoiMessage.createNumberMessages({ field: 'Original Price', min: 1 })),
    salePrice: joi
        .number()
        .min(1)
        .required()
        .messages(JoiMessage.createNumberMessages({ field: 'Sale Price', min: 1 })),
    duration: joi
        .number()
        .min(1)
        .required()
        .messages(JoiMessage.createNumberMessages({ field: 'Duration', min: 1 })),
};
