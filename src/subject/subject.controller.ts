import { UserService } from './../user/user.service';
import { AdminGuard, ExpertGuard } from './../auth/guard';
import { SubjectCategoryService } from './../subject-category/subject-category.service';
import { S3Service } from './../core/providers';
import { Subject, UserRole } from './../core/models';
import { ExpertService } from './../expert/expert.service';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from './../core/interface';
import { JoiValidatorPipe } from './../core/pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Post, UseInterceptors, Req, Res, Body, UploadedFile, HttpException, UsePipes, UseGuards, Get, Param, Put } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDTO, UpdateSubjectAdminDTO, UpdateSubjectDTO, vCreateSubjectDTO, vUpdateSubjectAdminDTO, vUpdateSubjectDTO } from './dto';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('subject')
@ApiBearerAuth()
@Controller('subject')
export class SubjectController {
    constructor(
        private readonly subjectService: SubjectService,
        private readonly expertService: ExpertService,
        private readonly userService: UserService,
        private readonly s3Service: S3Service,
        private readonly subjectCategoryService: SubjectCategoryService,
    ) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetSubject(@Param('id') id: string, @Res() res: Response) {
        const subject = await this.subjectService.getSubjectByField('id', id);

        if (!subject) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        subject.assignTo.user.password = '';
        subject.assignTo.user.token = '';
        return res.send(subject);
    }

    @Post('')
    @UseGuards(AdminGuard)
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vCreateSubjectDTO))
    async cCreateSubject(@Res() res: Response, @Body() body: CreateSubjectDTO, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new HttpException({ errorMessage: ResponseMessage.INVALID_IMAGE }, StatusCodes.BAD_REQUEST);

        const subjectCategory = await this.subjectCategoryService.getSubjectCategoryByField('id', body.category);
        if (!subjectCategory) throw new HttpException({ category: ResponseMessage.INVALID_CATEGORY }, StatusCodes.BAD_REQUEST);

        const expert = await this.expertService.getExpertByUserId(body.assignTo);

        const newSubject = new Subject();
        const date = new Date();
        newSubject.name = body.name;
        newSubject.tagLine = body.tagLine;
        newSubject.description = body.description;
        newSubject.category = subjectCategory;
        newSubject.isFeature = body.isFeature;
        newSubject.isActive = body.isActive;
        newSubject.assignTo = expert;
        newSubject.createdAt = date.toISOString();
        newSubject.updatedAt = date.toISOString();

        const result = await this.s3Service.uploadFile(file);
        if (result) newSubject.thumbnailUrl = result.Location;
        else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);

        await this.subjectService.saveSubject(newSubject);

        newSubject.assignTo.user.password = '';
        newSubject.assignTo.user.token = '';
        return res.send(newSubject);
    }

    @Put('/admin/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UseGuards(AdminGuard)
    @UsePipes(new JoiValidatorPipe(vUpdateSubjectAdminDTO))
    async cUpdateIsActive(@Param('id') id: string, @Res() res: Response, @Body() body: UpdateSubjectAdminDTO) {
        const subject = await this.subjectService.getSubjectByField('id', id);

        if (!subject) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        const expert = await this.expertService.getExpertByUserId(body.assignTo);
        subject.assignTo = expert || subject.assignTo;
        subject.isActive = body.isActive === null || body.isActive === undefined ? subject.isActive : body.isActive;
        subject.updatedAt = new Date().toISOString();

        await this.subjectService.saveSubject(subject);

        subject.assignTo.user.password = '';
        subject.assignTo.user.token = '';

        return res.send(subject);
    }

    @Put('/:id')
    @UseGuards(ExpertGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vUpdateSubjectDTO))
    async cUpdateSubject(@Param('id') id: string, @Req() req: Request, @Res() res: Response, @Body() body: UpdateSubjectDTO, @UploadedFile() file: Express.Multer.File) {
        const user = await this.userService.findUser('id', req.user.id);

        const subject = await this.subjectService.getSubjectByField('id', id);
        if (!subject) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        if (user.role.description !== UserRole.ADMIN && subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        if (body.category) {
            const category = await this.subjectCategoryService.getSubjectCategoryByField('id', body.category);
            subject.category = category;
        }

        subject.name = body.name || subject.name;
        subject.tagLine = body.tagLine || subject.tagLine;
        subject.description = body.description || subject.description;
        subject.isFeature = body.isFeature === null || body.isFeature === undefined ? subject.isFeature : body.isFeature;

        if (file) {
            const result = await this.s3Service.uploadFile(file);
            if (result) subject.thumbnailUrl = result.Location;
            else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        subject.updatedAt = new Date().toISOString();

        await this.subjectService.saveSubject(subject);
        subject.assignTo.user.password = '';
        subject.assignTo.user.token = '';

        return res.send(subject);
    }
}
