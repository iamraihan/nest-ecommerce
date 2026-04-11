import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ApiErrorResponseDto } from '../common/dto/api-response.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import {
  UserResponseEnvelopeDto,
  UsersListResponseEnvelopeDto,
} from './dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a user',
    description:
      'Creates a new user account and returns the sanitized user record.',
  })
  @ApiCreatedResponse({
    description: 'User created successfully.',
    type: UserResponseEnvelopeDto,
  })
  @ApiBadRequestResponse({
    description: 'Request body failed validation.',
    type: ApiErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'A user with the same unique email already exists.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error.',
    type: ApiErrorResponseDto,
  })
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List users',
    description:
      'Returns a paginated list of users ordered by creation date descending.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number to fetch.',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of items to return.',
    example: 20,
  })
  @ApiOkResponse({
    description: 'Paginated users fetched successfully.',
    type: UsersListResponseEnvelopeDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid pagination query parameters.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error.',
    type: ApiErrorResponseDto,
  })
  async findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Returns a single user by UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID.',
    format: 'uuid',
    example: '6d4e8a0a-0d51-4639-8b67-59f4fa23d9b2',
  })
  @ApiOkResponse({
    description: 'User fetched successfully.',
    type: UserResponseEnvelopeDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID format.',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error.',
    type: ApiErrorResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user',
    description: 'Updates a user by UUID. Password is re-hashed when supplied.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID.',
    format: 'uuid',
    example: '6d4e8a0a-0d51-4639-8b67-59f4fa23d9b2',
  })
  @ApiOkResponse({
    description: 'User updated successfully.',
    type: UserResponseEnvelopeDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID or request body.',
    type: ApiErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'A user with the same unique email already exists.',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error.',
    type: ApiErrorResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Soft delete a user',
    description:
      'Marks the user as deleted by updating the user status to DELETED.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID.',
    format: 'uuid',
    example: '6d4e8a0a-0d51-4639-8b67-59f4fa23d9b2',
  })
  @ApiOkResponse({
    description: 'User soft deleted successfully.',
    type: UserResponseEnvelopeDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID format.',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error.',
    type: ApiErrorResponseDto,
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
