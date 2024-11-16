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
import { ArtistService } from './artist.service';
import { isUUID } from 'class-validator';
import { CreateArtistDto, UpdateArtistDto } from './dto/';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAllArtists() {
    return this.artistService.findAll();
  }

  @Get(':id')
  async getArtistById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const artist = await this.artistService.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  @Post()
  createArtist(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  updateArtistInfo(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.artistService.updateArtist(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.artistService.delete(id);
  }
}
