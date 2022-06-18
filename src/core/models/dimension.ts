import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { JoiMessage } from 'joi-message';
import { DimensionType } from './dimension-type';
import { Subject } from './subject';

@Entity()
export class Dimension {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Name' })
    @Column({ default: null })
    name: string;

    @ApiProperty({ description: 'Description' })
    @Column('longtext', { default: null })
    description: string;

    @ApiProperty({ description: 'Dimension Type' })
    @ManyToOne(() => DimensionType, { nullable: false })
    type: DimensionType;

    @ApiProperty({ description: 'Subject' })
    @ManyToOne(() => Subject)
    subject: Subject;
}

export const dimensionValidateSchema = {
    name: joi
        .string()
        .min(3)
        .max(255)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Name', min: 3, max: 255 })),
    description: joi
        .string()
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Description' })),
};
