import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserDTO): Promise<User> {
    return await this.userService.createUser(data);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('data') data: number): Promise<boolean> {
    return await this.userService.deleteUser(data);
  }

  @Query(() => [User])
  async findAllUsers(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }
}
