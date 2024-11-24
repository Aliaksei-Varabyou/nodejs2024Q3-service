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
import LoggingService from './Logging/logging.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: true,
      logging: false,
      extra: {
        foreignKeys: true,
      },
      migrations: [join(__dirname, 'migrations/*.js')],
      migrationsRun: true,
    }),
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggingService],
  exports: [LoggingService],
})
export class AppModule {}
