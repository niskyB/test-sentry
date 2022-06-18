import { QuizResult } from './quiz-result';
import { QuizDetail } from './quiz-detail';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class AttendedQuestion {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Is marked' })
    @Column({ default: false })
    isMarked: boolean;

    @ApiProperty({ description: 'Question in Quiz' })
    @ManyToOne(() => QuizDetail, { nullable: false })
    questionInQuiz: QuizDetail;

    @ApiProperty({ description: 'Quiz Result' })
    @ManyToOne(() => QuizResult, { nullable: false })
    quizResult: QuizResult;
}
