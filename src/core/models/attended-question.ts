import { QuizResult } from './quiz-result';
import { QuestionInQuiz } from './question-in-quiz';
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
    @ManyToOne(() => QuestionInQuiz)
    questionInQuiz: QuestionInQuiz;

    @ApiProperty({ description: 'Quiz Result' })
    @ManyToOne(() => QuizResult)
    quizResult: QuizResult;
}
