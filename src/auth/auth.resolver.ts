import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { PayloadDTO } from './dto/payload.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => PayloadDTO)
  async login(@Args('data') data: AuthDTO) {
    const response = await this.authService.validateUser(
      data.email,
      data.password,
    );

    return {
      access_token: response.access_token,
    };
  }
}
