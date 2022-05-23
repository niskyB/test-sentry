import { ResponseMessage } from './../core/interface';
import { Body, Controller, Get, HttpException, Param, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CommonGuard } from '../auth/guard';
import { AuthService } from '../auth/auth.service';
import { JoiValidatorPipe } from '../core/pipe/validator.pipe';
import { ChangePasswordDTO, vChangePasswordDTO, UpdateUserDTO, vUpdateUserDTO } from './dto';
import { constant } from '../core';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../core/providers/s3/s3.service';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(CommonGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService, private readonly s3Service: S3Service, private readonly authService: AuthService) {}

    @Get('/me')
    async cGetMe(@Req() req: Request, @Res() res: Response) {
        const user = req.user;
        user.token = '';
        return res.send(user);
    }

    @Get('/:userId')
    async cGetOneById(@Param('userId') userId: string, @Res() res: Response, @Req() req: Request) {
        const user = await this.userService.findUser('id', userId);

        if (!user) throw new HttpException({ errorMessage: ResponseMessage.NOT_EXISTED_USER }, StatusCodes.NOT_FOUND);
        if (user.id !== req.user.id) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);
        return res.send(user);
    }

    @Put('/password')
    @UsePipes(new JoiValidatorPipe(vChangePasswordDTO))
    async changePassword(@Body() body: ChangePasswordDTO, @Res() res: Response, @Req() req: Request) {
        //get current user data
        const user = await this.userService.findUser('id', req.user.id);
        //check current input value is correct or not
        const isCorrectPassword = await this.authService.decryptPassword(body.currentPassword, user.password);
        if (!isCorrectPassword) {
            throw new HttpException({ currentPassword: ResponseMessage.INVALID_PASSWORD }, StatusCodes.BAD_REQUEST);
        }
        if (body.currentPassword === body.newPassword) throw new HttpException({ errorMessage: ResponseMessage.DUPLICATE_PASSWORD }, StatusCodes.BAD_REQUEST);
        //change password to new password
        user.password = await this.authService.encryptPassword(body.newPassword, constant.default.hashingSalt);
        await this.userService.saveUser(user);
        return res.send();
    }

    @Put('/')
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vUpdateUserDTO))
    async updateUserInformation(@Body() body: UpdateUserDTO, @Res() res: Response, @Req() req: Request, @UploadedFile() file: Express.Multer.File) {
        //get current user data
        const user = await this.userService.findUser('id', req.user.id);

        // update field
        user.fullName = body.fullName || user.fullName;
        user.gender = body.gender || user.gender;
        if (file) {
            const result = await this.s3Service.uploadFile(file);
            if (result) user.imageUrl = result.Location;
        }
        user.mobile = body.mobile || user.mobile;

        await this.userService.saveUser(user);
        return res.send(user);
    }
}
