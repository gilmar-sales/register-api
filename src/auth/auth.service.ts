import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import AuthPayload from 'src/@types/AuthPayload';

import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { PayloadDTO } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validadeUser(email: string, password: string): Promise<PayloadDTO> {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new BadRequestException('email not registered');

    if (compareSync(password, user.password)) {
      delete user.password;
      return this.login(user);
    } else throw new BadRequestException('wrong password!');
  }

  async login(user: User): Promise<PayloadDTO> {
    const payload: AuthPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
