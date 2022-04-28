import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import Role from 'src/@types/Role';

@InputType()
export class CreateUserDTO {
  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @Field()
  role: Role;
}
