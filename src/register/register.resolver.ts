import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RegisterService } from './register.service';
import { Register } from './register.entity';
import CreateRegisterDTO from './dto/create-register.dto';

@Resolver()
export class RegisterResolver {
  constructor(private readonly registerService: RegisterService) {}

  @Mutation(() => Register)
  async createRegister(
    @Args('data') data: CreateRegisterDTO,
  ): Promise<Register> {
    return this.registerService.createRegister(data);
  }

  @Query(() => [Register])
  async findAllRegisters(): Promise<Register[]> {
    return this.registerService.findAllRegisters();
  }

  @Query(() => [Register])
  async findRegistersByUser(@Args('userId') userId: number) {
    return this.registerService.findRegistersByUser(userId);
  }
}
