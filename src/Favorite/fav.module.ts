import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavController } from './fav.controller';
import { FavService } from './fav.service';
import { Favorite } from './fav.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite])],
  controllers: [FavController],
  providers: [FavService],
})
export class FavModule {}
