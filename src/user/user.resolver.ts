import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserDTO): Promise<User> {
    return await this.userService.createUser(data);
  }

  @UseGuards(RoleGuard)
  @Mutation(() => Boolean)
  async deleteUser(@Args('data') data: number): Promise<boolean> {
    return await this.userService.deleteUser(data);
  }

  @UseGuards(AuthGuard)
  @Query(() => User)
  async getUser(@Context() context): Promise<User> {
    const userId: number = context.req.user.id;
    return await this.userService.findById(userId);
  }

  @UseGuards(RoleGuard)
  @Query(() => [User])
  async findAllUsers(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }
}
