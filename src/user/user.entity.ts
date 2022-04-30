import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Register } from 'src/register/register.entity';
import EncryptTransformer from './transformers/encrypt.transformer';
import Role from 'src/@types/Role';

@ObjectType()
@Entity({ name: 'users' })
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @HideField()
  @Column({ transformer: EncryptTransformer })
  password: string;

  @Field()
  @Column({ default: 'collaborator' })
  role: Role;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Register])
  @OneToMany(() => Register, (register) => register.user)
  registers: Promise<Register[]>;
}
