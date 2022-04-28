import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/auth/guard/role.guard';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RoleGuard)
  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserDTO): Promise<User> {
    return await this.userService.createUser(data);
  }

  @UseGuards(RoleGuard)
  @Mutation(() => Boolean)
  async deleteUser(@Args('data') data: number): Promise<boolean> {
    return await this.userService.deleteUser(data);
  }

  @UseGuards(RoleGuard)
  @Query(() => [User])
  async findAllUsers(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }
}
