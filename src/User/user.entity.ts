import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude, Type } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  version: number;

  @Column({ type: 'bigint', nullable: true })
  @Type(() => Number)
  createdAt: number | null;

  @Column({ type: 'bigint', nullable: true })
  @Type(() => Number)
  updatedAt: number | null;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
