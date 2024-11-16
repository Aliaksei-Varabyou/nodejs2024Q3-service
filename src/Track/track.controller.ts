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
import { TrackService } from './track.service';
import { isUUID } from 'class-validator';
import { CreateTrackDto, UpdateTrackDto } from './dto/';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks() {
    return this.trackService.findAll();
  }

  @Get(':id')
  async getTrackById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const track = await this.trackService.findById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  @Post()
  createTrack(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Put(':id')
  updateTrackInfo(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.trackService.updateTrack(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.trackService.delete(id);
  }
}
