import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Lesson } from './lesson';

@Entity()
export class SubjectTopic {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Lesson' })
    @OneToOne(() => Lesson)
    lesson: Lesson;
}
