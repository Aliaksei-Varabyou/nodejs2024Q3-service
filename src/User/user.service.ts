import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  findAll() {
    return this.users;
  }

  findById(id: string) {
    return this.users.find(user => user.id === id);
  }

  create(createUserDto: CreateUserDto) {
    const newUser: User = {
      ...createUserDto,
      id: generateUuid(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    };
    this.users.push(newUser);
    return newUser;
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new Error('Old password does not match');
    }
    user.password = updatePasswordDto.newPassword;
    user.updatedAt = Date.now();
    user.version++;
    return user;
  }

  delete(id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    this.users.splice(index, 1);
  }
}

function generateUuid(): string {
  throw new Error('Function not implemented.');
}
