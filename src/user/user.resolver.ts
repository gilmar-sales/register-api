import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserDTO): Promise<User> {
    return await this.userService.createUser(data);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('administrator')
  @Mutation(() => Boolean)
  async deleteUser(@Args('userId') userId: number): Promise<boolean> {
    return await this.userService.deleteUser(userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => User)
  async getUser(@Context() context): Promise<User> {
    const userId: number = context.req.user.id;
    return await this.userService.findById(userId);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('administrator')
  @Query(() => [User])
  async findAllUsers(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }
}
