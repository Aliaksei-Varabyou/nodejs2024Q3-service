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
import { TrackService } from './track.service';
import { CreateTrackDto, UpdateTrackDto } from './dto/';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks() {
    return this.trackService.findAll();
  }

  @Get(':id')
  async getTrackById(@Param('id', ParseUUIDPipe) id: string) {
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.updateTrack(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.trackService.delete(id);
  }
}
