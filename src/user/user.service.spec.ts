import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const repositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
  };

  const mockData: CreateUserDTO = {
    name: 'collaborator',
    email: 'collaborator@brainny.cc',
    password: '12345678',
    role: 'collaborator',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: () => repositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    repositoryMock.create.mockReset();
    repositoryMock.save.mockReset();
    repositoryMock.findOneBy.mockReset();
    repositoryMock.find.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when create a user', () => {
    it('should create a collaborator', async () => {
      repositoryMock.findOneBy.mockReturnValue(null);
      repositoryMock.create.mockReturnValue(mockData);
      repositoryMock.save.mockReturnValue({ ...mockData, id: -1 });

      const { name, email, password } = mockData;
      const mockInput: CreateUserDTO = {
        name,
        email,
        password,
        role: 'collaborator',
      };

      const user = await service.createUser(mockInput);

      expect(user).toHaveProperty('id');
      expect(user).toMatchObject(mockData);
      expect(repositoryMock.findOneBy).toBeCalledWith({
        email: mockInput.email,
      });
      expect(repositoryMock.findOneBy).toBeCalledTimes(1);
      expect(repositoryMock.create).toBeCalledWith(mockInput);
      expect(repositoryMock.create).toBeCalledTimes(1);
      expect(repositoryMock.save).toBeCalledWith(mockData);
      expect(repositoryMock.save).toBeCalledTimes(1);
    });

    it('should be create a administrator', async () => {
      repositoryMock.findOneBy.mockReturnValue(null);
      repositoryMock.create.mockReturnValue(mockData);
      repositoryMock.save.mockReturnValue({
        ...mockData,
        id: -1,
        role: 'administrator',
      });

      const expectedUser = mockData;
      expectedUser.role = 'administrator';

      const mockInput: CreateUserDTO = {
        name: mockData.name,
        email: mockData.email,
        password: mockData.password,
        role: 'administrator',
      };

      const user = await service.createUser(mockInput);

      expect(user).toHaveProperty('id');
      expect(user).toMatchObject(expectedUser);
      expect(repositoryMock.findOneBy).toBeCalledWith({
        email: mockInput.email,
      });
      expect(repositoryMock.findOneBy).toBeCalledTimes(1);
      expect(repositoryMock.create).toBeCalledWith(mockInput);
      expect(repositoryMock.create).toBeCalledTimes(1);
      expect(repositoryMock.save).toBeCalledWith(mockData);
      expect(repositoryMock.save).toBeCalledTimes(1);
    });

    it('should not create a user with duplicate email', async () => {
      repositoryMock.findOneBy.mockReturnValue(mockData);

      const { name, email, password } = mockData;
      const mockInput: CreateUserDTO = {
        name,
        email,
        password,
        role: 'collaborator',
      };

      expect(service.createUser(mockInput)).rejects.toThrow(
        BadRequestException,
      );
      expect(repositoryMock.findOneBy).toBeCalledWith({
        email: mockInput.email,
      });
      expect(repositoryMock.findOneBy).toBeCalledTimes(1);
    });
  });

  describe('when search user by id or email', () => {
    it('should find a user by id', async () => {
      repositoryMock.findOneBy.mockReturnValue(mockData);

      const id = -1;
      const user = await service.findById(id);

      expect(user).toMatchObject(mockData);
      expect(repositoryMock.findOneBy).toBeCalledTimes(1);
    });

    it('should find a user by email', async () => {
      repositoryMock.findOneBy.mockReturnValue(mockData);

      const { email } = mockData;
      const user = await service.findByEmail(email);

      expect(user).toMatchObject(mockData);
      expect(repositoryMock.findOneBy).toBeCalledTimes(1);
    });

    it('should throw if not found a user', async () => {
      repositoryMock.findOneBy.mockReturnValue(null);

      const { email } = mockData;

      expect(service.findByEmail(email)).toMatchObject({});
      expect(repositoryMock.findOneBy).toBeCalledTimes(1);
    });
  });

  describe('when search all users', () => {
    it('should find all users', async () => {
      repositoryMock.find.mockReturnValue([mockData, mockData, mockData]);

      const users = await service.findAllUsers();

      expect(users).toHaveLength(3);
      expect(repositoryMock.find).toBeCalledTimes(1);
    });
  });
});
