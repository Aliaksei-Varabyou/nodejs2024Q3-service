import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { Album } from './album.entity';
import { Artist } from 'src/Artist/artist.entity';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { isUUID } from 'class-validator';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  async findById(id: string): Promise<object> {
    const album = await this.albumRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!album) {
      throw new NotFoundException(`Album with ID "${id}" not found`);
    }
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<object> {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new BadRequestException('Incorrect Data');
    }
    const newAlbum = this.albumRepository.create({
      ...createAlbumDto,
      id: uuidv4(),
    });
    const savedAlbum = await this.albumRepository.save(newAlbum);
    return savedAlbum;
  }

  async delete(id: string): Promise<void> {
    const result = await this.albumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Album with ID "${id}" not found`);
    }
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<object> {
    if (!updateAlbumDto.name || !updateAlbumDto.year) {
      throw new BadRequestException('Incorrect Data');
    }
    const album = await this.albumRepository.findOne({ where: { id: id } });
    if (!album) {
      throw new NotFoundException(`Album with ID "${id}" not found`);
    }
    if (!isUUID(updateAlbumDto.artistId)) {
      throw new BadRequestException(
        `Artist with ID "${updateAlbumDto.artistId}" does not exist`,
      );
    }
    const artist = await this.artistRepository.findOne({
      where: { id: updateAlbumDto.artistId },
    });
    if (!artist) {
      throw new BadRequestException(
        `Artist with ID "${updateAlbumDto.artistId}" does not exist`,
      );
    }

    const upadatedAlbum = {
      ...album,
      ...updateAlbumDto,
    };
    await this.albumRepository.save(upadatedAlbum);
    return upadatedAlbum;
  }
}
