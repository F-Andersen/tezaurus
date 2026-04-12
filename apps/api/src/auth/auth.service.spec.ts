import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

const mockUser = {
  id: 'user-id-1',
  email: 'admin@tezaurustour.com',
  passwordHash: '',
  role: 'ADMIN' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
};

const mockJwt = {
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    mockUser.passwordHash = await bcrypt.hash('password123', 10);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser()', () => {
    it('returns user without passwordHash on valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
      const result = await service.validateUser('admin@tezaurustour.com', 'password123');
      expect(result).not.toBeNull();
      expect(result).not.toHaveProperty('passwordHash');
      expect(result?.email).toBe('admin@tezaurustour.com');
    });

    it('returns null on wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
      const result = await service.validateUser('admin@tezaurustour.com', 'wrongpass');
      expect(result).toBeNull();
    });

    it('returns null when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const result = await service.validateUser('unknown@test.com', 'pass');
      expect(result).toBeNull();
    });
  });

  describe('login()', () => {
    it('returns accessToken and refreshToken', async () => {
      const result = await service.login({ id: mockUser.id, email: mockUser.email, role: mockUser.role });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(mockUser.email);
    });

    it('calls jwtService.sign for both tokens', async () => {
      await service.login({ id: mockUser.id, email: mockUser.email, role: mockUser.role });
      expect(mockJwt.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('refresh()', () => {
    it('throws UnauthorizedException on invalid token', async () => {
      mockJwt.verify.mockImplementationOnce(() => { throw new Error('invalid'); });
      await expect(service.refresh('bad-token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException if type is not refresh', async () => {
      mockJwt.verify.mockReturnValueOnce({ sub: 'user-id-1', type: 'access' });
      await expect(service.refresh('bad-token')).rejects.toThrow(UnauthorizedException);
    });

    it('returns new tokens when valid refresh token', async () => {
      mockJwt.verify.mockReturnValueOnce({ sub: mockUser.id, type: 'refresh' });
      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
      const result = await service.refresh('valid-refresh');
      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('logout()', () => {
    it('returns success', async () => {
      const result = await service.logout();
      expect(result).toEqual({ success: true });
    });
  });
});
