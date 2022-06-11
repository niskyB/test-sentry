import { ResponseMessage } from './../interface/message.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { joiPassword } from 'joi-password';
import * as joi from 'joi';
import { Role } from './role';
import { JoiMessage } from 'joi-message';

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

    @ApiProperty({ description: 'Created at' })
    @Column()
    createdAt: string;

    @ApiProperty({ description: 'Updated at' })
    @Column()
    updatedAt: string;

    @ApiProperty({ description: 'Role' })
    @ManyToOne(() => Role)
    role: Role;

    @ApiProperty({ description: 'Type Id' })
    @Column({ unique: true, nullable: true })
    typeId: string;
}

export const userValidateSchema = {
    fullName: joi
        .string()
        .min(3)
        .max(40)
        .trim()
        .lowercase()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Full Name', min: 3, max: 40 })),
    email: joi
        .string()
        .min(5)
        .max(255)
        .email()
        .trim()
        .lowercase()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Email' })),
    password: joiPassword
        .string()
        .min(8)
        .max(32)
        .trim()
        .alphanum()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Password', min: 8, max: 32 })),
    mobile: joi
        .string()
        .min(6)
        .max(20)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            ...JoiMessage.createStringMessages({
                field: 'Phone number',
                min: 6,
                max: 20,
            }),
            'string.pattern.base': ResponseMessage.INVALID_PHONE,
        }),
    gender: joi
        .string()
        .valid(Gender.MALE, Gender.FEMALE)
        .required()
        .messages({
            ...JoiMessage.createStringMessages({ field: 'Sex' }),
            'any.only': ResponseMessage.INVALID_GENDER,
        }),
    imageUrl: joi.string(),
};
