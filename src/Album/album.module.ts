import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { Album } from './album.entity';
import { ArtistModule } from 'src/Artist/artist.module';

@Module({
  imports: [TypeOrmModule.forFeature([Album]), ArtistModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
