import { Injectable, NotFoundException } from '@nestjs/common';
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
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.db.user.create({
      data: { ...dto, password: hashedPassword },
      select: userSelect,
    });
  }

  async findAll(query: PaginationQueryDto) {
    const [users, total] = await Promise.all([
      this.prisma.db.user.findMany({
        select: userSelect,
        skip: query.skip,
        take: query.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.db.user.count({
        where: { status: { not: 'DELETED' } },
      }),
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
  }

  async findOne(id: string) {
    const user = await this.prisma.db.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.db.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    const password: string | undefined = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;

    return this.prisma.db.user.update({
      where: { id },
      data: { ...dto, password },
      select: userSelect,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.db.user.update({
      where: { id },
      data: { status: 'DELETED' },
      select: userSelect,
    });
  }
}
