import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdatePasswordDto } from './dto/index';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: {
        id: id,
      },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create({
      ...createUserDto,
      id: generateUuid(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    });
    return this.userRepository.save(newUser);
  }

  async delete(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new Error('Old password does not match');
    }

    user.password = updatePasswordDto.newPassword;
    user.updatedAt = Date.now();
    user.version++;
    await this.userRepository.save(user);
    return user;
  }
}
