import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Register } from './register.entity';
import { RegisterResolver } from './register.resolver';
import { RegisterService } from './register.service';

@Module({
  imports: [TypeOrmModule.forFeature([Register])],
  providers: [RegisterResolver, RegisterService],
})
export class RegisterModule {}
