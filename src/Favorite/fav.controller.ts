import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavService } from './fav.service';

@Controller('favs')
export class FavController {
  constructor(private readonly favService: FavService) {}

  @Get()
  getAllFavs() {
    return this.favService.findAll();
  }

  @Post('track/:id')
  addTrackToFav(@Param('id') id: string) {
    return this.favService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id') id: string) {
    return this.favService.deleteTrack(id);
  }

  @Post('album/:id')
  addAlbumToFav(@Param('id') id: string) {
    return this.favService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id') id: string) {
    return this.favService.deleteAlbum(id);
  }

  @Post('artist/:id')
  addArtistToFav(@Param('id') id: string) {
    return this.favService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id') id: string) {
    return this.favService.deleteArtist(id);
  }
}
