import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorDetailDto {
  @ApiProperty({
    description: 'HTTP status code for the failed request.',
    example: 400,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Human-readable error message.',
    example: 'Validation failed',
  })
  message!: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({
    description: 'Indicates whether the request succeeded.',
    example: false,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Structured error payload.',
    type: ApiErrorDetailDto,
  })
  error!: ApiErrorDetailDto;

  @ApiProperty({
    description: 'ISO-8601 timestamp of the error response.',
    example: '2026-04-11T12:00:00.000Z',
  })
  timestamp!: string;
}

export class HealthResponseEnvelopeDto {
  @ApiProperty({
    description: 'Indicates whether the request succeeded.',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Simple application status message.',
    example: 'Hello World!',
  })
  data!: string;

  @ApiProperty({
    description: 'ISO-8601 timestamp of the successful response.',
    example: '2026-04-11T12:00:00.000Z',
  })
  timestamp!: string;
}
