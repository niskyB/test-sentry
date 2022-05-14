import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../core/models';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/core/providers';
import { EmailAction } from 'src/core/interface/email.enum';
@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService, private readonly emailService: EmailService) {}

    // ---------------------------Bcrypt Service---------------------------
    async encryptPassword(password: string, saltOrRounds: number): Promise<string> {
        return await bcrypt.hash(password, saltOrRounds);
    }

    async decryptPassword(enteredPassword: string, passwordInDatabase: string): Promise<boolean> {
        return await bcrypt.compare(enteredPassword, passwordInDatabase);
    }

    // ---------------------------Token Service---------------------------
    async encryptAccessToken(tokenData: Record<any, any>, minutes?: number) {
        try {
            if (minutes) {
                return await this.jwtService.signAsync(tokenData, { expiresIn: minutes * 60 });
            } else {
                return this.jwtService.signAsync(tokenData);
            }
        } catch (err) {
            return null;
        }
    }

    async verifyToken<T>(tokenData: string): Promise<{ data: T; error: any }> {
        try {
            return { data: (await this.jwtService.verifyAsync<any>(tokenData)) as T, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    }

    async createAccessToken(user: User, minutes?: number): Promise<string> {
        const token = this.encryptAccessToken({ id: user.id }, minutes);
        return token;
    }
    // --------------------------- Send Email Service ---------------------------

    async sendEmailToken(user: User, action: EmailAction): Promise<boolean> {
        const otp = await this.createAccessToken(user, 5);

        let isSend;
        if (action === EmailAction.verifyEmail) {
            isSend = await this.emailService.sendEmailForVerify(user.email, otp);
        }
        if (action === EmailAction.resetPassword) {
            isSend = await this.emailService.sendResetPassword(user.email, otp);
        }

        user.token = otp;

        if (isSend) {
            this.userService.saveUser(user);
        }

        return isSend;
    }
}
