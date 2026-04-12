import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: (dto.role as UserRole) || UserRole.CONTENT_MANAGER,
      },
    });
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    if (dto.email) {
      const existing = await this.prisma.user.findFirst({
        where: { email: dto.email, NOT: { id } },
      });
      if (existing) throw new ConflictException('Email already exists');
    }
    const data: { email?: string; role?: UserRole; passwordHash?: string } = {};
    if (dto.email) data.email = dto.email;
    if (dto.role) data.role = dto.role as UserRole;
    if (dto.password) data.passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }
}
