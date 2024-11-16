import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { isUUID } from 'class-validator';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  getAllAlbums() {
    return this.albumService.findAll();
  }

  @Get(':id')
  async getAlbumById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const album = await this.albumService.findById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  @Post()
  createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  updateAlbumInfo(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.albumService.updateAlbum(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.albumService.delete(id);
  }
}
