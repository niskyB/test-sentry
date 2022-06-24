import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../../user/user.service';
import { JwtToken } from '../../core/interface';

@Injectable()
export class RegistrationGuard implements CanActivate {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();

        const authorization = req.headers['authorization'] || '';
        const token = this.getTokenFromHeader(authorization);

        const { data } = await this.authService.verifyToken<JwtToken>(token);
        const user = await this.userService.findUser('id', data.id);

        if (user && !user.isActive) {
            throw new HttpException({}, StatusCodes.UNAUTHORIZED);
        }

        user.password = '';
        req.user = user;

        return true;
    }

    getTokenFromHeader(authorization: string): string {
        const accessToken = authorization.split(' ')[1];
        return accessToken;
    }
}
