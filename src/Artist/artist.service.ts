import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { CreateArtistDto, UpdateArtistDto } from './dto/';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async findById(id: string): Promise<object> {
    const artist = await this.artistRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!artist) {
      throw new NotFoundException(`Artist with ID "${id}" not found`);
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<object> {
    if (!createArtistDto.name || !createArtistDto.grammy) {
      throw new BadRequestException('Incorrect Data');
    }
    const newArtist = this.artistRepository.create({
      ...createArtistDto,
      id: uuidv4(),
    });
    const savedArtist = await this.artistRepository.save(newArtist);
    return savedArtist;
  }

  async delete(id: string): Promise<void> {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Artist with ID "${id}" not found`);
    }
  }

  async updateArtist(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<object> {
    if (
      !updateArtistDto.name ||
      !(typeof updateArtistDto.grammy === 'boolean')
    ) {
      throw new BadRequestException('Incorrect Data');
    }
    const artist = await this.artistRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!artist) {
      throw new NotFoundException(`Artist with ID "${id}" not found`);
    }

    const upadatedArtist = {
      ...artist,
      ...updateArtistDto,
    };
    await this.artistRepository.save(upadatedArtist);
    return upadatedArtist;
  }
}
