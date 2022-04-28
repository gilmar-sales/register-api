import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RegisterService } from './register.service';
import { Register } from './register.entity';
import CreateRegisterDTO from './dto/create-register.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/auth/guard/role.guard';

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

  @UseGuards(AuthGuard, RoleGuard)
  @Query(() => [Register])
  async findAllRegisters(): Promise<Register[]> {
    return this.registerService.findAllRegisters();
  }

  @UseGuards(AuthGuard)
  @Query(() => [Register])
  async findUserRegisters(@Context() context) {
    const userId = context.req.user.id;

    return this.registerService.findRegistersByUser(userId);
  }
}
