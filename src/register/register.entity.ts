import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../user/user.entity';

@ObjectType()
@Entity({ name: 'registered_time' })
export class Register {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn()
  timeRegistered: Date;

  @Field()
  @Column()
  type: 'in' | 'out';

  @Field()
  @Column()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.registers)
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;
}
