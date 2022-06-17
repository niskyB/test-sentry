import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Question } from './question';
import { Quiz } from './quiz';

@Entity()
export class QuestionInQuiz {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Question' })
    @ManyToOne(() => Question)
    question: Question;

    @ApiProperty({ description: 'Quiz' })
    @ManyToOne(() => Quiz)
    quiz: Quiz;
}
