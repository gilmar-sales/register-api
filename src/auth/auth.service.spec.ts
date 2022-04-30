import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcrypt';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  const mockData = {
    email: 'admin@brainny.cc',
    password: 'admin123',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    usersServiceMock.findByEmail.mockReset();
    usersServiceMock.findById.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when validate user', () => {
    it('should validate user', async () => {
      const password = hashSync(mockData.password, 10);
      usersServiceMock.findByEmail.mockReturnValue({
        ...mockData,
        password,
      });
      jwtServiceMock.sign.mockReturnValue('valid_token');

      const result = await service.validateUser(
        mockData.email,
        mockData.password,
      );

      expect(result).toHaveProperty('access_token');
      expect(usersServiceMock.findByEmail).toBeCalledTimes(1);
    });

    it('should throw if user password is invalid', async () => {
      usersServiceMock.findByEmail.mockReturnValue(mockData);

      expect(
        service.validateUser(mockData.email, mockData.password),
      ).rejects.toThrow(BadRequestException);
      expect(usersServiceMock.findByEmail).toBeCalledTimes(1);
    });
  });
});
