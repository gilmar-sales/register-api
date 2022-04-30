import { Test, TestingModule } from '@nestjs/testing';
import { RegisterResolver } from './register.resolver';
import { RegisterService } from './register.service';
import { User } from '../user/user.entity';
import CreateRegisterDTO from './dto/create-register.dto';
import { PubSub } from 'graphql-subscriptions';

describe('RegisterResolver', () => {
  let resolver: RegisterResolver;

  const serviceMock = {
    createRegister: jest.fn(),
    findRegistersByUser: jest.fn(),
    findAllRegisters: jest.fn(),
  };

  const pubSubMock = {
    asyncIterator: jest.fn(),
    publish: jest.fn(),
  };

  const mockData: CreateRegisterDTO = {
    timeRegistered: new Date(),
    type: 'in',
  };

  const contextMock = {
    req: {
      user: {
        id: -1,
      },
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterResolver,
        { provide: RegisterService, useValue: serviceMock },
        { provide: PubSub, useValue: pubSubMock },
      ],
    }).compile();

    resolver = module.get<RegisterResolver>(RegisterResolver);
  });

  beforeEach(() => {
    serviceMock.createRegister.mockReset();
    serviceMock.findRegistersByUser.mockReset();
    serviceMock.findAllRegisters.mockReset();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('when create a register', () => {
    it('should return the created register', async () => {
      serviceMock.createRegister.mockReturnValue({ ...mockData, id: -1 });

      const user = new User();
      user.id = -1;

      const register = await resolver.createRegister(mockData, contextMock);

      expect(register).toHaveProperty('id');
      expect(register).toMatchObject(mockData);
      expect(serviceMock.createRegister).toBeCalledWith(user.id, mockData);
      expect(serviceMock.createRegister).toBeCalledTimes(1);
    });
  });

  describe('when search register by user id', () => {
    it('should find all the registers of a user by their id', async () => {
      serviceMock.findRegistersByUser.mockReturnValue([mockData, mockData]);

      const userId = -1;
      const registers = await resolver.findRegistersByUser(userId);

      expect(registers).toHaveLength(2);
      expect(registers);
      expect(serviceMock.findRegistersByUser).toBeCalledWith(userId);
      expect(serviceMock.findRegistersByUser).toBeCalledTimes(1);
    });
  });

  describe('when search all registers', () => {
    it('should find all registers', async () => {
      serviceMock.findAllRegisters.mockReturnValue([
        mockData,
        mockData,
        mockData,
      ]);

      const registers = await resolver.findAllRegisters();

      expect(registers).toHaveLength(3);
      expect(serviceMock.findAllRegisters).toBeCalledTimes(1);
    });
  });
});
