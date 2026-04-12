import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  type: 'access';
}

export interface JwtRefreshPayload {
  sub: string;
  type: 'refresh';
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return null;
    }
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async login(user: { id: string; email: string; role: UserRole }) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role, type: 'access' };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    });
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' } as JwtRefreshPayload,
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
      },
    );
    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtRefreshPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      if (payload.type !== 'refresh') throw new UnauthorizedException();
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      const { passwordHash: _, ...u } = user;
      return this.login(u);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout() {
    // Optional: blacklist refresh token in Redis/DB. For MVP we rely on client discarding cookie.
    return { success: true };
  }
}
