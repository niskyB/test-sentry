import { CustomerService } from './../customer/customer.service';
import { Body, Controller, Get, HttpException, Param, Post, Res, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { StatusCodes } from 'http-status-codes';
import { LoginDTO, vLoginDTO, RegisterDTO, vRegisterDTO, vRequestVerifyEmailDTO, RequestVerifyEmailDTO, vRequestResetPasswordDTO, RequestResetPasswordDTO } from './dto';
import { constant } from '../core/constant';
import { UserRole, Customer, User } from '../core/models';
import { JoiValidatorPipe } from '../core/pipe';
import { JwtToken, EmailAction, ResponseMessage } from '../core/interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService, private readonly customerService: CustomerService) {}

    @Post('/verify-email')
    @UsePipes(new JoiValidatorPipe(vRequestVerifyEmailDTO))
    async cSendVerifyEmail(@Body() body: RequestVerifyEmailDTO, @Res() res: Response) {
        const user = await this.userService.findUser('email', body.email);

        if (!user) {
            throw new HttpException({ errorMessage: ResponseMessage.NOT_EXISTED_USER }, StatusCodes.BAD_REQUEST);
        }

        if (!this.authService.sendEmailToken(user, EmailAction.VERIFY_EMAIL, user.password)) {
            throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return res.send();
    }

    @Get('/verify-email/:otp')
    async cVerifyEmail(@Param('otp') otp: string, @Res() res: Response) {
        const { data, error } = await this.authService.verifyToken<JwtToken>(otp);
        if (error) {
            throw new HttpException({ errorMessage: ResponseMessage.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED);
        }

        const user = await this.userService.findUser('id', data.id);
        if (!user) {
            throw new HttpException({ errorMessage: ResponseMessage.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED);
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
        if (user) throw new HttpException({ email: ResponseMessage.EMAIL_TAKEN }, StatusCodes.BAD_REQUEST);

        const newUser = new User();
        let newCustomer = new Customer();
        newUser.fullName = body.fullName;
        newUser.email = body.email;
        newUser.password = await this.authService.encryptPassword(body.password, constant.default.hashingSalt);
        newUser.gender = body.gender;
        newUser.mobile = body.mobile;
        newCustomer.user = newUser;
        newUser.role = await this.userService.findRole('description', UserRole.CUSTOMER);
        newUser.createdAt = new Date().toISOString();
        newUser.updatedAt = new Date().toISOString();
        await this.userService.saveUser(newUser);
        await this.customerService.saveCustomer(newCustomer);

        newCustomer = await this.customerService.getCustomerByUserId(newUser.id);
        newUser.typeId = newCustomer.id;

        await this.userService.saveUser(newUser);

        const isSend = await this.authService.sendEmailToken(newUser, EmailAction.VERIFY_EMAIL, newUser.password);

        if (!isSend) {
            throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return res.send();
    }

    @Post('/login')
    @ApiOperation({ summary: 'Login' })
    @ApiCreatedResponse({ type: String, description: 'access token' })
    @UsePipes(new JoiValidatorPipe(vLoginDTO))
    async cLogin(@Body() body: LoginDTO, @Res() res: Response) {
        const user = await this.userService.findUser('email', body.email);
        if (!user) throw new HttpException({ errorMessage: ResponseMessage.INVALID_EMAIL_PASSWORD }, StatusCodes.BAD_REQUEST);
        if (!user.isActive) throw new HttpException({ errorMessage: ResponseMessage.EMAIL_NOT_ACTIVE }, StatusCodes.BAD_REQUEST);

        const isCorrectPassword = await this.authService.decryptPassword(body.password, user.password);
        if (!isCorrectPassword) throw new HttpException({ errorMessage: ResponseMessage.INVALID_EMAIL_PASSWORD }, StatusCodes.BAD_REQUEST);

        const accessToken = await this.authService.createAccessToken(user);
        return res.cookie(constant.authController.tokenName, accessToken, { maxAge: constant.authController.loginCookieTime }).send(accessToken);
    }

    @Post('/logout')
    @ApiOperation({ summary: 'Logout user account' })
    async cLogout(@Res() res: Response) {
        return res.cookie(constant.authController.tokenName, '', { maxAge: -999 }).send();
    }

    @Post('/send-reset-password/')
    @UsePipes(new JoiValidatorPipe(vRequestVerifyEmailDTO))
    async cSendResetPassword(@Body() body: RequestVerifyEmailDTO, @Res() res: Response) {
        const user = await this.userService.findUser('email', body.email);

        if (!user) {
            throw new HttpException({ errorMessage: ResponseMessage.NOT_EXISTED_USER }, StatusCodes.BAD_REQUEST);
        }

        const isSend = await this.authService.sendEmailToken(user, EmailAction.RESET_PASSWORD, user.password);

        if (!isSend) {
            throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
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

        if (user.token === null || user.token !== body.token) {
            throw new HttpException({ errorMessage: '' }, StatusCodes.BAD_REQUEST);
        }

        user.password = await this.authService.encryptPassword(body.password, constant.default.hashingSalt);
        user.token = null;
        user.updatedAt = new Date().toISOString();

        await this.userService.saveUser(user);

        return res.send();
    }
}
