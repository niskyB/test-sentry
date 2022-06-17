import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class QuestionLevel {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Type' })
    @Column({ default: null })
    type: string;

    @ApiProperty({ description: 'Value' })
    @Column({ default: null })
    value: string;

    @ApiProperty({ description: 'Order' })
    @Column({ default: null, unique: true })
    order: string;

    @ApiProperty({ description: 'Description' })
    @Column({ default: null })
    description: string;

    @ApiProperty({ description: 'Is Active' })
    @Column({ default: true })
    isActive: boolean;
}
