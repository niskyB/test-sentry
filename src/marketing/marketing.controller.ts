import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('marketing')
@ApiBearerAuth()
@Controller('marketing')
export class MarketingController {}
