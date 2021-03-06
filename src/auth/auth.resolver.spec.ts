import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  const serviceMock = {
    validateUser: jest.fn(),
  };

  const mockData = {
    name: 'admin',
    email: 'admin@brainny.cc',
    password: 'admin',
    role: 'collaborator',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useFactory: () => serviceMock },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  beforeEach(() => {
    serviceMock.validateUser.mockReset();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('when login', () => {
    it('should validate user and return a token', async () => {
      serviceMock.validateUser.mockReturnValue({
        mockData,
        access_token: 'valid_token',
      });

      const { email, password } = mockData;
      const result = await resolver.login({ email, password });

      expect(result).toHaveProperty('access_token', 'valid_token');
      expect(serviceMock.validateUser).toBeCalledWith(email, password);
      expect(serviceMock.validateUser).toBeCalledTimes(1);
    });
  });
});
