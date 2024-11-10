import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4, validate } from 'uuid';
import { Repository, Not, IsNull } from 'typeorm';
import { Favorite } from './fav.entity';
import { Track } from 'src/Track/track.entity';
import { Album } from 'src/Album/album.entity';
import { Artist } from 'src/Artist/artist.entity';

const checkUUid = (id: string) => {
  if (!validate(id)) {
    throw new BadRequestException('Incorrect UUID');
  }
};

@Injectable()
export class FavService {
  constructor(
    @InjectRepository(Favorite)
    private favRepository: Repository<Favorite>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  async findAll(): Promise<{ artists: any[]; albums: any[]; tracks: any[] }> {
    const favoriteArtists = await this.favRepository.find({
      where: { artistId: Not(IsNull()) },
      relations: ['artist'],
    });
    const favoriteAlbums = await this.favRepository.find({
      where: { albumId: Not(IsNull()) },
      relations: ['album'],
    });
    const favoriteTracks = await this.favRepository.find({
      where: { trackId: Not(IsNull()) },
      relations: ['track'],
    });
    return {
      artists: favoriteArtists.map((fav) => fav.artist),
      albums: favoriteAlbums.map((fav) => fav.album),
      tracks: favoriteTracks.map((fav) => fav.track),
    };
  }

  async addTrack(trackId: string): Promise<Favorite> {
    checkUUid(trackId);
    const existingArtist = await this.trackRepository.findOne({
      where: { id: trackId },
    });
    if (!existingArtist) {
      throw new UnprocessableEntityException(
        `Track with id "${trackId}" not found`,
      );
    }
    const existingFav = await this.favRepository.findOne({
      where: { trackId: trackId },
      relations: ['track'],
    });
    if (existingFav) {
      throw new BadRequestException(
        `Fav with tarckId "${trackId}" already exists`,
      );
    }

    const favorite = new Favorite();
    favorite.userId = uuidv4();
    favorite.trackId = trackId;
    await this.favRepository.save(favorite);
    return favorite;
  }

  async deleteTrack(trackId: string): Promise<void> {
    checkUUid(trackId);
    const favorite = await this.favRepository.findOne({
      where: { trackId: trackId },
      relations: ['track'],
    });
    if (!favorite) {
      throw new NotFoundException(`Fav with trackId "${trackId}" not found`);
    }
    await this.favRepository.remove(favorite);
  }

  async addAlbum(albumId: string): Promise<Favorite> {
    checkUUid(albumId);
    const existingArtist = await this.albumRepository.findOne({
      where: { id: albumId },
    });
    if (!existingArtist) {
      throw new UnprocessableEntityException(
        `Album with id "${albumId}" not found`,
      );
    }
    const existingFav = await this.favRepository.findOne({
      where: { albumId: albumId },
      relations: ['album'],
    });
    if (existingFav) {
      throw new BadRequestException(
        `Fav with albumId "${albumId}" already exists`,
      );
    }

    const favorite = new Favorite();
    favorite.userId = uuidv4();
    favorite.albumId = albumId;
    await this.favRepository.save(favorite);
    return favorite;
  }

  async deleteAlbum(albumId: string): Promise<void> {
    checkUUid(albumId);
    const favorite = await this.favRepository.findOne({
      where: { albumId: albumId },
      relations: ['album'],
    });
    if (!favorite) {
      throw new NotFoundException(`Fav with albumId "${albumId}" not found`);
    }
    await this.favRepository.remove(favorite);
  }

  async addArtist(artistId: string): Promise<Favorite> {
    checkUUid(artistId);
    const existingArtist = await this.artistRepository.findOne({
      where: { id: artistId },
    });
    if (!existingArtist) {
      throw new UnprocessableEntityException(
        `Artist with id "${artistId}" not found`,
      );
    }
    const existingFav = await this.favRepository.findOne({
      where: { artistId: artistId },
      relations: ['artist'],
    });
    if (existingFav) {
      throw new BadRequestException(
        `Fav with artistId "${artistId}" already exists`,
      );
    }

    const favorite = new Favorite();
    favorite.userId = uuidv4();
    favorite.artistId = artistId;
    await this.favRepository.save(favorite);
    return favorite;
  }

  async deleteArtist(artistId: string): Promise<void> {
    checkUUid(artistId);
    const favorite = await this.favRepository.findOne({
      where: { artistId: artistId },
      relations: ['artist'],
    });
    if (!favorite) {
      throw new NotFoundException(`Fav with artistId "${artistId}" not found`);
    }
    await this.favRepository.remove(favorite);
  }
}
