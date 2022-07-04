import { CommonGuard } from './../auth/guard';
import { Controller, UseGuards, Res, Get, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';

@ApiTags('customer')
@ApiBearerAuth()
@Controller('customer')
@UseGuards(CommonGuard)
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Get('')
    async cGetDimensionById(@Req() req: Request, @Res() res: Response) {
        const customer = await this.customerService.getCustomerByUserId(req.user.id);
        if (!customer) return res.send(null);

        return res.send(customer);
    }
}
