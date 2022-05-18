import { S3Service } from 'src/core/providers/s3/s3.service';
import { ResponseMessage } from './../core/interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Slider } from './../core/models';
import { UserService } from '../user/user.service';
import { CreateSliderDTO, vCreateSliderDTO } from './dto';
import { JoiValidatorPipe } from './../core/pipe/validator.pipe';
import { MarketingGuard } from './../auth/guard';
import { Body, Controller, Post, Req, Res, UseGuards, UsePipes, UseInterceptors, UploadedFile, HttpException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SliderService } from './slider.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

@ApiTags('slider')
@ApiBearerAuth()
@UseGuards(MarketingGuard)
@Controller('slider')
export class SliderController {
    constructor(private readonly sliderService: SliderService, private readonly userService: UserService, private readonly s3Service: S3Service) {}

    @Post('')
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vCreateSliderDTO))
    async cCreateSlider(@Req() req: Request, @Res() res: Response, @Body() body: CreateSliderDTO, @UploadedFile() file: Express.Multer.File) {
        const user = await this.userService.findUser('id', req.user.id);

        if (!file) throw new HttpException({ errorMessage: ResponseMessage.INVALID_IMAGE }, StatusCodes.BAD_REQUEST);

        const newSlider = new Slider();
        newSlider.title = body.title;
        newSlider.backLink = body.backLink;
        newSlider.user = user;
        const result = await this.s3Service.uploadFile(file);
        if (result) user.imageUrl = result.Location;
        else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        await this.sliderService.saveSlider(newSlider);

        return res.send(newSlider);
    }
}
