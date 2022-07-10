import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';
import { Customer } from './customer';
import { AttendedQuestion } from './attended-question';

@Entity()
export class QuizResult {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Rate' })
    @Column({ type: 'double', default: null })
    rate: number;

    @ApiProperty({ description: 'Created At' })
    @Column()
    createdAt: string;

    @ApiProperty({ description: 'Customer' })
    @ManyToOne(() => Customer, { cascade: true, nullable: false })
    customer: Customer;

    @ApiProperty({ description: 'Customer' })
    @OneToMany(() => AttendedQuestion, (attendedQuestion) => attendedQuestion.quizResult)
    attendedQuestions: AttendedQuestion[];
}

export const quizResultValidateSchema = {
    rate: joi
        .number()
        .min(1)
        .max(100)
        .required()
        .messages(JoiMessage.createNumberMessages({ field: 'Rate' })),
};
