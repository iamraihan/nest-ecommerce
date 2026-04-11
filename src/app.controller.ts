import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthResponseEnvelopeDto } from './common/dto/api-response.dto';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({
    summary: 'Application health check',
    description: 'Returns a simple message confirming that the API is running.',
  })
  @ApiOkResponse({
    description: 'Application responded successfully.',
    type: HealthResponseEnvelopeDto,
  })
  getHealth(): string {
    return this.appService.getHealth();
  }
}
