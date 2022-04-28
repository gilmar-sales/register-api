import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';

import { Register } from './register.entity';
import { RegisterResolver } from './register.resolver';
import { RegisterService } from './register.service';

@Module({
  imports: [TypeOrmModule.forFeature([Register])],
  providers: [RegisterResolver, RegisterService, PubSub],
})
export class RegisterModule {}
