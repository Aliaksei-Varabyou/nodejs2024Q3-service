import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { Track } from './track.entity';
import { CreateTrackDto, UpdateTrackDto } from './dto/';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  async findAll(): Promise<Track[]> {
    return this.trackRepository.find();
  }

  async findById(id: string): Promise<object> {
    const track = await this.trackRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!track) {
      throw new NotFoundException(`Track with ID "${id}" not found`);
    }
    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<object> {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new BadRequestException('Incorrect Data');
    }
    const newTrack = this.trackRepository.create({
      ...createTrackDto,
      id: uuidv4(),
    });
    const savedTrack = await this.trackRepository.save(newTrack);
    return savedTrack;
  }

  async delete(id: string): Promise<void> {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Track with ID "${id}" not found`);
    }
  }

  async updateTrack(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<object> {
    if (!updateTrackDto.name || !updateTrackDto.duration) {
      throw new BadRequestException('Incorrect Data');
    }
    const track = await this.trackRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!track) {
      throw new NotFoundException(`Track with ID "${id}" not found`);
    }

    const upadatedTrack = {
      ...track,
      ...updateTrackDto,
    };
    await this.trackRepository.save(upadatedTrack);
    return upadatedTrack;
  }
}
