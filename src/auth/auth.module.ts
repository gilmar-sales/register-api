import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { jwtConfig } from 'src/config/jwt.config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(jwtConfig),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, AuthResolver, UserService],
  exports: [AuthService],
})
export class AuthModule {}
