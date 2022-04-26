import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserDTO {
  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @Field()
  role: string;
}
