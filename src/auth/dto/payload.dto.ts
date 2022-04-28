import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PayloadDTO {
  @Field()
  access_token: string;
}
