import { Registration } from './registration';
import { Subject } from './subject';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

    @ApiProperty({ description: 'Description' })
    @Column('longtext', { default: null })
    description: string;

    @ApiProperty({ description: 'Is Active' })
    @Column({ default: true })
    isActive: boolean;

    @ApiProperty({ description: 'Created at' })
    @Column()
    createdAt: string;

    @ApiProperty({ description: 'Updated at' })
    @Column()
    updatedAt: string;

    @ApiProperty({ description: 'Marketing' })
    @ManyToOne(() => Subject, { nullable: false })
    subject: Subject;

    @ApiProperty({ description: 'Marketing' })
    @OneToMany(() => Registration, (registration) => registration.pricePackage)
    registrations: Registration[];
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
    description: joi
        .string()
        .required()
        .trim()
        .messages(JoiMessage.createStringMessages({ field: 'Description' })),
};
