import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { RegisterService } from './register.service';
import { Register } from './register.entity';
import CreateRegisterDTO from './dto/create-register.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Resolver()
export class RegisterResolver {
  constructor(
    private readonly registerService: RegisterService,
    private readonly pubSub: PubSub,
  ) {}

  @UseGuards(AuthGuard)
  @Roles('collaborator')
  @Mutation(() => Register)
  async createRegister(
    @Args('data') data: CreateRegisterDTO,
    @Context() context,
  ): Promise<Register> {
    const userId: number = context.req.user.id;

    const register = this.registerService.createRegister(userId, data);

    this.pubSub.publish('registerCreated', { registerCreated: register });

    return register;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('administrator')
  @Query(() => [Register])
  async findAllRegisters(): Promise<Register[]> {
    return this.registerService.findAllRegisters();
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('administrator')
  @Query(() => [Register])
  async findRegistersByUser(@Args('userId') userId: number) {
    return this.registerService.findRegistersByUser(userId);
  }

  @UseGuards(AuthGuard)
  @Roles('collaborator')
  @Query(() => [Register])
  async findUserRegisters(@Context() context) {
    const userId = context.req.user.id;

    return this.registerService.findRegistersByUser(userId);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('administrator')
  @Subscription(() => Register, {
    name: 'registerCreated',
  })
  async registerCreationHandler() {
    return this.pubSub.asyncIterator('registerCreated');
  }
}
