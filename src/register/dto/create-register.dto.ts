import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export default class CreateRegisterDTO {
  @Field()
  @IsNotEmpty()
  timeRegistered: Date;

  @Field()
  type: 'in' | 'out';

  @Field()
  userId: number;
}
