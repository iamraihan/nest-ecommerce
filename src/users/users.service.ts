import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  phoneVerified: true,
  emailVerified: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      return await this.prisma.db.user.create({
        data: { ...dto, password: hashedPassword },
        select: userSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A user with this email already exists');
      }
      this.logger.error('Failed to create user', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(query: PaginationQueryDto) {
    try {
      const [users, total] = await Promise.all([
        this.prisma.db.user.findMany({
          select: userSelect,
          skip: query.skip,
          take: query.take,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.db.user.count(),
      ]);

      return {
        users,
        meta: {
          total,
          page: query.page!,
          limit: query.limit!,
          totalPages: Math.ceil(total / query.limit!),
        },
      };
    } catch (error) {
      this.logger.error('Failed to fetch users', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.db.user.findUnique({
        where: { id },
        select: userSelect,
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch user ${id}`, error);
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.db.user.findUnique({
        where: { email },
      });
    } catch (error) {
      this.logger.error(`Failed to fetch user by email ${email}`, error);
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    try {
      const password: string | undefined = dto.password
        ? await bcrypt.hash(dto.password, 10)
        : undefined;

      return await this.prisma.db.user.update({
        where: { id },
        data: { ...dto, password },
        select: userSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A user with this email already exists');
      }
      this.logger.error(`Failed to update user ${id}`, error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      return await this.prisma.db.user.update({
        where: { id },
        data: { status: 'DELETED' },
        select: userSelect,
      });
    } catch (error) {
      this.logger.error(`Failed to remove user ${id}`, error);
      throw new InternalServerErrorException('Failed to remove user');
    }
  }
}
