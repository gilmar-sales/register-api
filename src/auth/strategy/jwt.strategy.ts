import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwtConfig } from 'src/config/jwt.config';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import AuthPayload from 'src/@types/AuthPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
      signOptions: jwtConfig.signOptions,
    });
  }

  async validate(payload: AuthPayload): Promise<User> {
    const user = await this.userService.findByEmail(payload.email);

    if (!user) {
      return null;
    }

    return user;
  }
}
