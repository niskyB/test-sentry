import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { Customer } from './customer';

@Entity()
export class QuizResult {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Rate' })
    @Column({ default: null })
    rate: number;

    @ApiProperty({ description: 'Created At' })
    @Column()
    createdAt: string;

    @ApiProperty({ description: 'Customer' })
    @ManyToOne(() => Customer, { cascade: true })
    customer: Customer;
}

export const quizResultValidateSchema = {
    rate: joi
        .number()
        .min(1)
        .max(100)
        .required()
        .messages(JoiMessage.createNumberMessages({ field: 'Rate' })),
};
