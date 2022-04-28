import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateRegisterDTO from './dto/create-register.dto';

import { Register } from './register.entity';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(Register)
    private readonly repository: Repository<Register>,
  ) {}

  async createRegister(userId: number, data: CreateRegisterDTO) {
    const register = this.repository.create({ userId: userId, ...data });

    return this.repository.save(register);
  }

  public async findAllRegisters() {
    const registers = await this.repository.find({ order: { id: 'DESC' } });

    return registers;
  }

  public async findRegistersByUser(userId: number) {
    const registers = await this.repository.find({
      where: { userId },
      order: { id: 'DESC' },
    });

    return registers;
  }
}
