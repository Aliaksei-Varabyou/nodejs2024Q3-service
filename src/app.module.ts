import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './User/user.module';
import { TrackModule } from './Track/track.module';
import { ArtistModule } from './Artist/artist.module';
import { AlbumModule } from './Album/album.module';
import { FavModule } from './Favorite/fav.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: true,
      logging: true,
      extra: {
        foreignKeys: true,
      },
    }),
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
