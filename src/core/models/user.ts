import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { joiPassword } from 'joi-password';
import * as joi from 'joi';
import { Role } from './role';

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

@Entity()
export class User {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Full name' })
    @Column({ default: null })
    fullName: string;

    @ApiProperty({ description: 'Password' })
    @Column({ default: null })
    password: string;

    @ApiProperty({ description: 'Email' })
    @Column({ default: null })
    email: string;

    @ApiProperty({ description: 'Gender' })
    @Column({ default: null })
    gender: string;

    @ApiProperty({ description: 'Mobile' })
    @Column({ default: null })
    mobile: string;

    @ApiProperty({ description: 'Token' })
    @Column({ default: null })
    token: string;

    @ApiProperty({ description: 'Image Url' })
    @Column({ default: null })
    imageUrl: string;

    @ApiProperty({ description: 'Is active' })
    @Column({ default: false })
    isActive: boolean;

    @ApiProperty({ description: 'Create at' })
    @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    createAt: Date;

    @ApiProperty({ description: 'Update at' })
    @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    updateAt: Date;

    @ApiProperty({ description: 'Role' })
    @ManyToOne(() => Role)
    role: Role;

    @ApiProperty({ description: 'Type Id' })
    @Column({ unique: true, nullable: true })
    typeId: string;
}

export const userValidateSchema = {
    fullName: joi.string().min(3).max(40).trim().lowercase().required(),
    email: joi.string().min(5).max(255).email().trim().lowercase().required(),
    password: joiPassword.string().min(8).max(32).trim().alphanum().required(),
    mobile: joi
        .string()
        .min(6)
        .max(20)
        .pattern(/^[0-9]+$/)
        .required(),
    gender: joi
        .string()
        .valid(Gender.MALE || Gender.FEMALE)
        .required(),
    imageUrl: joi.string(),
};
