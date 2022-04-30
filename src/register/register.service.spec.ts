import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import CreateRegisterDTO from './dto/create-register.dto';
import { Register } from './register.entity';
import { RegisterService } from './register.service';

describe('RegisterService', () => {
  let service: RegisterService;

  const repositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockData: CreateRegisterDTO = {
    timeRegistered: new Date(),
    type: 'in',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        { provide: getRepositoryToken(Register), useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
  });

  beforeEach(() => {
    repositoryMock.create.mockReset();
    repositoryMock.save.mockReset();
    repositoryMock.find.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when create a register', () => {
    it('should be create a employee', async () => {
      repositoryMock.create.mockReturnValue(mockData);
      repositoryMock.save.mockReturnValue({ ...mockData, id: -1 });

      const register = await service.createRegister(-1, mockData);

      expect(register).toHaveProperty('id');
      expect(register).toMatchObject(mockData);
      expect(repositoryMock.create).toBeCalledWith({
        ...mockData,
        userId: -1,
      });
      expect(repositoryMock.create).toBeCalledTimes(1);
      expect(repositoryMock.save).toBeCalledWith(mockData);
      expect(repositoryMock.save).toBeCalledTimes(1);
    });
  });

  describe('when search register by user id', () => {
    it('should find all the registers of a user by their id', async () => {
      repositoryMock.find.mockReturnValue([mockData, mockData]);

      const userId = -1;
      const registers = await service.findRegistersByUser(userId);

      expect(registers).toHaveLength(2);
      expect(repositoryMock.find).toBeCalledWith({
        order: { id: 'DESC' },
        where: { userId },
      });
      expect(repositoryMock.find).toBeCalledTimes(1);
    });
  });

  describe('when search all registers', () => {
    it('should find all registers', async () => {
      repositoryMock.find.mockReturnValue([mockData, mockData, mockData]);

      const registers = await service.findAllRegisters();

      expect(registers).toHaveLength(3);
      expect(repositoryMock.find).toBeCalledTimes(1);
    });
  });
});
