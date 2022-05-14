import { Body, Controller, Get, HttpException, Param, Post, Req, Res, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { StatusCodes } from 'http-status-codes';
import { LoginDTO, vLoginDTO, RegisterDTO, vRegisterDTO, vRequestVerifyEmailDTO, RequestVerifyEmailDTO, vRequestResetPasswordDTO, RequestResetPasswordDTO } from './dto';
import { constant } from '../core/constant';
import { User, UserRole } from '../core/models';
import { JoiValidatorPipe } from '../core/pipe/validator.pipe';
import { JwtToken } from '../core/interface';
import { EmailService } from '../core/providers';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService, private readonly emailService: EmailService) {}

    @Post('/verify-email')
    @UsePipes(new JoiValidatorPipe(vRequestVerifyEmailDTO))
    async cSendVerifyEmail(@Body() body: RequestVerifyEmailDTO, @Res() res: Response) {
        const user = await this.userService.findUser('email', body.email);

        if (!user) {
            throw new HttpException({ errorMessage: 'error.not_found' }, StatusCodes.BAD_REQUEST);
        }

        if (!this.authService.sendEmailToken(user)) {
            throw new HttpException({ errorMessage: 'error.something_wrong' }, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return res.send();
    }

    @Get('/verify-email/:otp')
    async cVerifyEmail(@Param('otp') otp: string, @Res() res: Response) {
        const { data, error } = await this.authService.verifyToken<JwtToken>(otp);
        if (error) {
            throw new HttpException({ errorMessage: '' }, StatusCodes.UNAUTHORIZED);
        }

        const user = await this.userService.findUser('id', data.id);
        if (!user) {
            throw new HttpException({ errorMessage: '' }, StatusCodes.UNAUTHORIZED);
        }

        user.isActive = true;
        await this.userService.saveUser(user);

        return res.send();
    }

    @Post('/register')
    @ApiOperation({ summary: 'Create new user' })
    @ApiCreatedResponse({ type: String, description: 'access token' })
    @UsePipes(new JoiValidatorPipe(vRegisterDTO))
    async cRegister(@Body() body: RegisterDTO, @Res() res: Response) {
        const user = await this.userService.findUser('email', body.email);
        if (user) throw new HttpException({ email: 'field.field-taken' }, StatusCodes.BAD_REQUEST);

        const newUser = user || new User();
        newUser.fullName = body.fullName;
        newUser.email = body.email;
        newUser.password = await this.authService.encryptPassword(body.password, constant.default.hashingSalt);
        newUser.gender = body.gender;
        newUser.mobile = body.mobile;
        newUser.role = await this.userService.findRole('name', UserRole.CUSTOMER);

        const insertedUser = await this.userService.saveUser(newUser);

        const accessToken = await this.authService.createAccessToken(insertedUser);
        return res.cookie(constant.authController.tokenName, accessToken, { maxAge: constant.authController.registerCookieTime }).send({ token: accessToken });
    }

    @Post('/login')
    @ApiOperation({ summary: 'Login' })
    @ApiCreatedResponse({ type: String, description: 'access token' })
    @UsePipes(new JoiValidatorPipe(vLoginDTO))
    async cLogin(@Body() body: LoginDTO, @Res() res: Response) {
        const user = await this.userService.findUser('email', body.email);
        if (!user) throw new HttpException({ errorMessage: 'error.invalid-password-username' }, StatusCodes.BAD_REQUEST);
        if (!user.isActive) throw new HttpException({ errorMessage: 'error.email-not-active' }, StatusCodes.BAD_REQUEST);

        const isCorrectPassword = await this.authService.decryptPassword(body.password, user.password);
        if (!isCorrectPassword) throw new HttpException({ errorMessage: 'error.invalid-password-username' }, StatusCodes.BAD_REQUEST);

        const accessToken = await this.authService.createAccessToken(user);
        return res.cookie(constant.authController.tokenName, accessToken, { maxAge: constant.authController.loginCookieTime }).send(accessToken);
    }

    @Post('/logout')
    @ApiOperation({ summary: 'Logout user account' })
    async cLogout(@Req() req: Request, @Res() res: Response) {
        return res.cookie(constant.authController.tokenName, '', { maxAge: -999 }).send();
    }

    @Post('/send-reset-password')
    @UsePipes(new JoiValidatorPipe(vRequestVerifyEmailDTO))
    async cSendResetPassword(@Body() body: RequestVerifyEmailDTO, @Res() res: Response) {
        const user = await this.userService.findUser('email', body.email);

        if (!user) {
            throw new HttpException({ errorMessage: 'error.not_found' }, StatusCodes.BAD_REQUEST);
        }

        if (!this.authService.sendEmailToken(user)) {
            throw new HttpException({ errorMessage: 'error.something_wrong' }, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return res.send();
    }

    @Post('/reset-password')
    @UsePipes(new JoiValidatorPipe(vRequestResetPasswordDTO))
    async cResetPassword(@Body() body: RequestResetPasswordDTO, @Res() res: Response) {
        const { data, error } = await this.authService.verifyToken<JwtToken>(body.token);
        if (error) {
            throw new HttpException({ errorMessage: '' }, StatusCodes.UNAUTHORIZED);
        }

        const user = await this.userService.findUser('id', data.id);

        if (!user) {
            throw new HttpException({ errorMessage: '' }, StatusCodes.UNAUTHORIZED);
        }

        user.password = await this.authService.encryptPassword(body.password, constant.default.hashingSalt);

        await this.userService.saveUser(user);

        return res.send();
    }
}
