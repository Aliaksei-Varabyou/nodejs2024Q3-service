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
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  getAllAlbums() {
    return this.albumService.findAll();
  }

  @Get(':id')
  async getAlbumById(@Param('id', ParseUUIDPipe) id: string) {
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.updateAlbum(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumService.delete(id);
  }
}
