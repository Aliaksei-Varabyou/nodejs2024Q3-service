import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavController } from './fav.controller';
import { FavService } from './fav.service';
import { Favorite } from './fav.entity';
import { TrackModule } from 'src/Track/track.module';
import { AlbumModule } from 'src/Album/album.module';
import { ArtistModule } from 'src/Artist/artist.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    TrackModule,
    AlbumModule,
    ArtistModule,
  ],
  controllers: [FavController],
  providers: [FavService],
})
export class FavModule {}
