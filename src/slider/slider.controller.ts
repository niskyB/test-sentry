import { S3Service } from 'src/core/providers/s3/s3.service';
import { ResponseMessage } from './../core/interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Slider } from './../core/models';
import { UserService } from '../user/user.service';
import { CreateSliderDTO, vCreateSliderDTO, vUpdateSliderDTO, UpdateSliderDTO } from './dto';
import { JoiValidatorPipe } from './../core/pipe/validator.pipe';
import { MarketingGuard } from './../auth/guard';
import { Body, Controller, Post, Req, Res, UseGuards, UsePipes, UseInterceptors, UploadedFile, HttpException, Get, Param, Put } from '@nestjs/common';
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

    @Get('/:id')
    async cGetSlider(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        const slider = await this.sliderService.getSliderByField('id', id);
        if (!slider) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        return res.send(slider);
    }

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

    @Put('/:id')
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vUpdateSliderDTO))
    async cUpdateSlider(@Param('id') id: string, @Req() req: Request, @Res() res: Response, @Body() body: UpdateSliderDTO, @UploadedFile() file: Express.Multer.File) {
        const user = await this.userService.findUser('id', req.user.id);
        const slider = await this.sliderService.getSliderByField('id', id);

        if (!slider) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        if (slider.user.id !== user.id) throw new HttpException({ errorMessage: ResponseMessage.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED);

        slider.title = body.title || slider.title;
        slider.backLink = body.backLink || slider.backLink;
        if (file) {
            const result = await this.s3Service.uploadFile(file);
            if (result) user.imageUrl = result.Location;
            else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        }
        await this.sliderService.saveSlider(slider);

        return res.send(slider);
    }
}
