import { Role, UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'Unique identifier of the user.',
    format: 'uuid',
    example: '6d4e8a0a-0d51-4639-8b67-59f4fa23d9b2',
  })
  id!: string;

  @ApiProperty({
    description: 'User first name.',
    example: 'Raihan',
  })
  firstName!: string;

  @ApiProperty({
    description: 'User last name.',
    example: 'Ali',
  })
  lastName!: string;

  @ApiProperty({
    description: 'Unique email address.',
    example: 'raihan@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Phone number in E.164 format when available.',
    example: '+8801712345678',
    nullable: true,
    required: false,
  })
  phone?: string | null;

  @ApiProperty({
    description: 'Whether the phone number has been verified.',
    example: false,
  })
  phoneVerified!: boolean;

  @ApiProperty({
    description: 'Whether the email address has been verified.',
    example: false,
  })
  emailVerified!: boolean;

  @ApiProperty({
    description: 'Assigned authorization role.',
    enum: Role,
    example: Role.CUSTOMER,
  })
  role!: Role;

  @ApiProperty({
    description: 'Current lifecycle status of the user.',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @ApiProperty({
    description: 'Creation timestamp.',
    format: 'date-time',
    example: '2026-04-11T12:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp.',
    format: 'date-time',
    example: '2026-04-11T12:00:00.000Z',
  })
  updatedAt!: Date;
}

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Total number of records available.',
    example: 125,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page number.',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Maximum number of items returned per page.',
    example: 20,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of pages.',
    example: 7,
  })
  totalPages!: number;
}

export class UsersListDto {
  @ApiProperty({
    description: 'List of users for the current page.',
    type: [UserDto],
  })
  users!: UserDto[];

  @ApiProperty({
    description: 'Pagination metadata.',
    type: PaginationMetaDto,
  })
  meta!: PaginationMetaDto;
}

export class UserResponseEnvelopeDto {
  @ApiProperty({
    description: 'Indicates whether the request succeeded.',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Wrapped user payload.',
    type: UserDto,
  })
  data!: UserDto;

  @ApiProperty({
    description: 'ISO-8601 timestamp of the successful response.',
    example: '2026-04-11T12:00:00.000Z',
  })
  timestamp!: string;
}

export class UsersListResponseEnvelopeDto {
  @ApiProperty({
    description: 'Indicates whether the request succeeded.',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Wrapped paginated user collection.',
    type: UsersListDto,
  })
  data!: UsersListDto;

  @ApiProperty({
    description: 'ISO-8601 timestamp of the successful response.',
    example: '2026-04-11T12:00:00.000Z',
  })
  timestamp!: string;
}
