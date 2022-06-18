import { QuizResult } from './quiz-result';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user';

@Entity()
export class Customer {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Balance' })
    @Column({ default: 0 })
    balance: number;

    @ApiProperty({ description: 'User' })
    @OneToOne(() => User, { nullable: false })
    @JoinColumn()
    user: User;

    @ApiProperty({ description: 'Quiz Result' })
    @OneToMany(() => QuizResult, (quizResults) => quizResults.customer)
    quizResults: QuizResult[];
}
