import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async createUser(data: CreateUserDTO): Promise<User> {
    const getUserByEmail = await this.findByEmail(data.email);

    if (getUserByEmail)
      throw new BadRequestException('email is already being used');

    const user = this.repository.create(data);

    return this.repository.save(user);
  }

  async deleteUser(data: number): Promise<boolean> {
    const user = await this.repository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: data })
      .execute();

    return Boolean(user.affected);
  }

  async findAllUsers(): Promise<User[]> {
    const users = await this.repository.find();
    return users;
  }

  async findByEmail(data: string): Promise<User> {
    return await this.repository.findOneBy({ email: data });
  }
  async findById(data: number): Promise<User> {
    return await this.repository.findOneBy({ id: data });
  }
}
