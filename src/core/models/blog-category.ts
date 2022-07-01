import { SystemType } from './../interface';
import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class BlogCategory {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Type' })
    @Column({ default: SystemType.BLOG_CATEGORY })
    type: string;

    @ApiProperty({ description: 'Value' })
    @Column()
    @Generated('uuid')
    value: string;

    @ApiProperty({ description: 'Order' })
    @Column()
    order: number;

    @ApiProperty({ description: 'Description' })
    @Column({ default: null })
    description: string;

    @ApiProperty({ description: 'Is Active' })
    @Column({ default: true })
    isActive: boolean;
}
