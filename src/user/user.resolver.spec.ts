import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UserResolver', () => {
  let resolver: UserResolver;

  const serviceMock = {
    createUser: jest.fn(),
    findAllUsers: jest.fn(),
  };

  const mockData = {
    name: 'collaborator',
    email: 'collaborator@brainny.cc',
    password: '12345678',
    role: 'collaborator',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: serviceMock },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  beforeEach(() => {
    serviceMock.createUser.mockReset();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('when create a user', () => {
    it('should return the created user', async () => {
      serviceMock.createUser.mockReturnValue({ ...mockData, id: 'any_id' });

      const { name, email, password } = mockData;
      const mockInput: CreateUserDTO = {
        name,
        email,
        password,
        role: 'collaborator',
      };
      const user = await resolver.createUser(mockInput);

      expect(user).toHaveProperty('id');
      expect(user).toMatchObject(mockData);
      expect(serviceMock.createUser).toBeCalledWith(mockInput);
      expect(serviceMock.createUser).toBeCalledTimes(1);
    });
  });

  describe('when search all users', () => {
    it('should find all users', async () => {
      serviceMock.findAllUsers.mockReturnValue([mockData, mockData, mockData]);

      const registers = await resolver.findAllUsers();

      expect(registers).toHaveLength(3);
      expect(serviceMock.findAllUsers).toBeCalledTimes(1);
    });
  });
});
