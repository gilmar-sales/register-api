import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RegisterService } from './register.service';
import { Register } from './register.entity';
import CreateRegisterDTO from './dto/create-register.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class RegisterResolver {
  constructor(private readonly registerService: RegisterService) {}

  @UseGuards(new AuthGuard())
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

  @UseGuards(new AuthGuard())
  @Query(() => [Register])
  async findRegistersByUser(@Args('userId') userId: number) {
    return this.registerService.findRegistersByUser(userId);
  }
}
