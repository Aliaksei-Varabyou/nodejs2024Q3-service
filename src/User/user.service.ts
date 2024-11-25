import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { instanceToPlain } from 'class-transformer';
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

  async findById(id: string): Promise<object> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return instanceToPlain(new User(user));
  }

  async findByLogin(login: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { login } });
  }

  async create(createUserDto: CreateUserDto): Promise<object> {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Incorrect Data');
    }
    const newUser = this.userRepository.create({
      ...createUserDto,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    });
    const savedUser = await this.userRepository.save(newUser);
    return instanceToPlain(new User(savedUser));
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
  ): Promise<object> {
    if (!updatePasswordDto.oldPassword || !updatePasswordDto.newPassword) {
      throw new BadRequestException('Incorrect Data');
    }
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password does not match');
    }

    user.password = updatePasswordDto.newPassword;
    user.updatedAt = Date.now();
    user.version++;
    await this.userRepository.save(user);
    return instanceToPlain(new User(user));
  }
}
