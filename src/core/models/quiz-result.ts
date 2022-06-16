import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { Quiz } from './quiz';

@Entity()
export class QuizResult {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Quiz' })
    @ManyToOne(() => Quiz)
    quiz: Quiz;

    @ApiProperty({ description: 'Rate' })
    @Column({ default: null })
    rate: number;

    @ApiProperty({ description: 'Created At' })
    @Column()
    createdAt: string;
}

export const quizResultValidateSchema = {
    rate: joi
        .number()
        .min(1)
        .max(100)
        .required()
        .messages(JoiMessage.createNumberMessages({ field: 'Rate' })),
};
