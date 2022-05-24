import { UserService } from './../user/user.service';
import { ExpertGuard } from './../auth/guard';
import { SubjectCategoryService } from './../subject-category/subject-category.service';
import { S3Service } from './../core/providers/s3/s3.service';
import { Subject, UserRole } from './../core/models';
import { ExpertService } from './../expert/expert.service';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from './../core/interface';
import { JoiValidatorPipe } from './../core/pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Post, UseInterceptors, Req, Res, Body, UploadedFile, HttpException, UsePipes, UseGuards, Get, Param, Put } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDTO, UpdateSubjectDTO, vCreateSubjectDTO, vUpdateSubjectDTO } from './dto';
import { Request, Response } from 'express';

@Controller('subject')
@UseGuards(ExpertGuard)
export class SubjectController {
    constructor(
        private readonly subjectService: SubjectService,
        private readonly expertService: ExpertService,
        private readonly userService: UserService,
        private readonly s3Service: S3Service,
        private readonly subjectCategoryService: SubjectCategoryService,
    ) {}

    @Get('/:id')
    async cGetSlider(@Param('id') id: string, @Res() res: Response) {
        const subject = await this.subjectService.getSubjectByField('id', id);
        if (!subject) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        return res.send(subject);
    }

    @Post('')
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vCreateSubjectDTO))
    async cCreateSlider(@Req() req: Request, @Res() res: Response, @Body() body: CreateSubjectDTO, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new HttpException({ errorMessage: ResponseMessage.INVALID_IMAGE }, StatusCodes.BAD_REQUEST);

        const subjectCategory = await this.subjectCategoryService.getSubjectCategoryByField('name', body.category);
        if (!subjectCategory) throw new HttpException({ category: ResponseMessage.INVALID_CATEGORY }, StatusCodes.BAD_REQUEST);

        const expert = await this.expertService.getExpertByUserId(body.assignTo);

        const newSubject = new Subject();
        newSubject.name = body.name;
        newSubject.tagLine = body.tagLine;
        newSubject.description = body.description;
        newSubject.category = subjectCategory;
        newSubject.assignTo = expert;

        const result = await this.s3Service.uploadFile(file);
        if (result) newSubject.thumbnailUrl = result.Location;
        else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);

        await this.subjectService.saveSubject(newSubject);

        return res.send(newSubject);
    }

    @Put('/:id')
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vUpdateSubjectDTO))
    async cUpdateSlider(@Param('id') id: string, @Req() req: Request, @Res() res: Response, @Body() body: UpdateSubjectDTO, @UploadedFile() file: Express.Multer.File) {
        const user = await this.userService.findUser('id', req.user.id);
        const subject = await this.subjectService.getSubjectByField('id', id);

        if (!subject) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        if (user.role.name !== UserRole.ADMIN && subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        const expert = await this.expertService.getExpertByUserId(body.assignTo);

        subject.name = body.name || subject.name;
        subject.tagLine = body.tagLine || subject.tagLine;
        subject.description = body.description || subject.description;
        subject.isActive = body.isActive === null || body.isActive === undefined ? subject.isActive : body.isActive;
        subject.assignTo = expert || subject.assignTo;

        if (file) {
            const result = await this.s3Service.uploadFile(file);
            if (result) subject.thumbnailUrl = result.Location;
            else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        await this.subjectService.saveSubject(subject);

        return res.send(subject);
    }
}
